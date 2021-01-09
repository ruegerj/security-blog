import { User } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { IUnitOfWork } from '@data-access/uow/interfaces';
import { LoginDto, SignUpDto, TokenResponseDto } from '@domain/dtos';
import { Role } from '@domain/dtos/enums/role.enum';
import { ICredentials } from '@domain/dtos/interfaces';
import { IConfig } from '@infrastructure/config/interfaces';
import {
	TooManyRequestsError,
	UnauthorizedError,
	ValidationFailedError,
} from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import {
	IAuthenticationService,
	IHashingService,
	ILoginAttemptService,
	ITokenService,
} from './interfaces';

/**
 * Explicit implementation of `IAuthenticationService`
 */
@Service({ id: Tokens.IAuthenticationService })
export class AuthenticationService implements IAuthenticationService {
	constructor(
		@Inject(Tokens.IUnitOfWorkFactory)
		private uowFactory: IUnitOfWorkFactory,

		@Inject(Tokens.ILoginAttemptService)
		private loginAttemptService: ILoginAttemptService,

		@Inject(Tokens.IHashingService)
		private hashingService: IHashingService,

		@Inject(Tokens.ITokenService)
		private tokenService: ITokenService,

		@Inject(Tokens.ILogger)
		private logger: ILogger,

		@Inject(Tokens.IConfig)
		private config: IConfig,
	) {}

	/**
	 * Validates the given login params and log the user in if they are valid
	 * @param model Dto containing all nescessary login parameters
	 * @returns Dto containing both access- and refresh-token for the user
	 */
	async login(model: LoginDto): Promise<TokenResponseDto> {
		const authenticatedUser = await this.getAuthenticatedUser(model);

		// Credentials invalid => abort request
		if (!authenticatedUser) {
			// TODO: Store failed attempt
			// this.loginAttemptService.createAttempt(false, model.email);

			// Abort request as unauthorized
			throw new UnauthorizedError('Invalid credentials');
		}

		// Validate given challenge token
		const validatedChallengeToken = await this.tokenService.verifyChallengeToken(
			model.token,
			authenticatedUser,
		);

		if (!validatedChallengeToken.valid) {
			// TODO: Store failed attempt
			//this.loginAttemptService.createAttempt(false, model.email);

			// Abort request as unauthorized
			throw new UnauthorizedError(
				`Invalid challenge token, reason: ${validatedChallengeToken.reason}`,
			);
		}

		// Check if attempts have been exceeded
		const attempsExceeded = await this.loginAttemptsExceeded(
			authenticatedUser,
		);

		if (attempsExceeded) {
			const windowMinutes =
				this.config.auth.loginTimeWindowMS / 1000 / 60;

			this.logger.warn(
				'Blocked login request due to too many failed login attempts',
				authenticatedUser.email,
			);

			throw new TooManyRequestsError(
				`Too many failed login requests. Try again in ${windowMinutes} minutes`,
				windowMinutes * 60,
			);
		}

		let loginUnit: IUnitOfWork;

		try {
			loginUnit = this.uowFactory.create(true);
			await loginUnit.begin();

			// Update token version of user
			authenticatedUser.tokenVersion += 1;

			// Credentials and challenge are valid => issue tokens
			const accessToken = await this.tokenService.issueAccessToken(
				authenticatedUser,
				authenticatedUser.roles,
			);

			const refreshToken = await this.tokenService.issueRefreshToken(
				authenticatedUser,
			);

			await loginUnit.users.update(authenticatedUser);

			await loginUnit.commit();

			this.logger.info(
				`Logged in user: ${authenticatedUser.email}`,
				authenticatedUser.id,
				authenticatedUser.email,
			);

			return {
				accessToken,
				refreshToken,
			};
		} catch (error) {
			this.logger.error(
				'Encountered error while signin in user',
				error,
				authenticatedUser.email,
			);

			// Attempt rollback
			await loginUnit?.rollback();

			throw error;
		}
	}

	/**
	 * Issues a new access token if the given refresh token is valid
	 * @param refreshToken Refresh token which authenticates the user and is used to issue a new access token
	 * @returns Newly issued access token
	 */
	async refreshAccessToken(refreshToken: string): Promise<string> {
		const validatedRefreshToken = await this.tokenService.verifyRefreshToken(
			refreshToken,
		);

		// Check if refresh token is valid
		if (!validatedRefreshToken.valid) {
			this.logger.warn('Refresh attempt with invalid refresh token');

			throw new UnauthorizedError(
				`Invalid refresh token, reason: ${validatedRefreshToken.reason}`,
			);
		}

		const refreshUnit = this.uowFactory.create(false);
		await refreshUnit.begin();

		const requestingUser = await refreshUnit.users.getByIdWithRoles(
			validatedRefreshToken.payload.subject,
		);

		// Check if subject of token exists
		if (!requestingUser) {
			await refreshUnit.rollback();

			this.logger.warn(
				'Refresh attempt whith valid refresh token, but unknown subject',
			);

			throw new UnauthorizedError(
				'Invalid refresh token, reason: unknown subject',
			);
		}

		const providedTokenVersion = validatedRefreshToken.payload.version;

		// Check if token versions allign
		if (requestingUser.tokenVersion !== providedTokenVersion) {
			await refreshUnit.rollback();

			this.logger.warn(
				`Refresh attempt with a token version mismatch for user: ${requestingUser.email}`,
				requestingUser.id,
				requestingUser.email,
			);

			throw new UnauthorizedError(
				'Invalid refresh token, reason: token version mismatch',
			);
		}

		// Everything is fine => issue new acces token for user
		const accessToken = await this.tokenService.issueAccessToken(
			requestingUser,
			requestingUser.roles,
		);

		this.logger.info(
			`Refreshed access token for user: ${requestingUser.email}`,
			requestingUser.id,
			requestingUser.email,
		);

		await refreshUnit.commit();

		return accessToken;
	}

	/**
	 * Logs the user with the given id out
	 * @param userId Id of the user which should be logged out
	 */
	async logout(userId: string): Promise<void> {
		const logoutUnit = this.uowFactory.create(true);
		await logoutUnit.begin();

		const user = await logoutUnit.users.getById(userId);

		// No user with this id => something probably went wrong during access token generation
		if (!user) {
			throw new Error(
				`Logout failed, regarding user with the id ${userId} couldn't be found`,
			);
		}

		// Increase token version to revoke issued refresh tokens
		user.tokenVersion += 1;

		await logoutUnit.users.update(user);

		await logoutUnit.commit();

		this.logger.info(`Logged out user: ${user.email}`, user.id, user.email);
	}

	/**
	 * Valdiates the given credentials, if valid the corresponding user entity is returned
	 * @param credentials Email and plain password of the user
	 * @returns User if credentials valid, else null
	 */
	async getAuthenticatedUser(credentials: ICredentials): Promise<User> {
		// Credits: https://stackoverflow.com/a/46181
		const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		const validateUnit = this.uowFactory.create(false);
		await validateUnit.begin();

		let user: User;

		// If matches => user identity is users email
		if (credentials.userIdentity.match(emailRegexp)) {
			user = await validateUnit.users.getByEmailWithRoles(
				credentials.userIdentity,
			);
		} else {
			// User identity is the username
			user = await validateUnit.users.getByUsernameWithRoles(
				credentials.userIdentity,
			);
		}

		if (!user) {
			await validateUnit.rollback();

			return null;
		}

		const validPassword = await this.hashingService.verify(
			credentials.password,
			user.password,
		);

		await validateUnit.commit();

		if (!validPassword) {
			return null;
		}

		return user;
	}

	/**
	 * Checks if the max amount of failed login attempts have been exceeded by the given user
	 * @param user User for which the login attempts shall be checked
	 * @returns Boolean if the max attempts have been exceeded
	 */
	async loginAttemptsExceeded(user: User): Promise<boolean> {
		const attemptUnit = this.uowFactory.create(false);
		await attemptUnit.begin();

		// Calculate timestamp for time window
		const unix = new Date().valueOf();
		const timelimit = new Date(unix - this.config.auth.loginTimeWindowMS);

		const failedAttempts = await attemptUnit.loginAttempts.getAllFailedFromUserSince(
			user,
			timelimit,
		);

		await attemptUnit.commit();

		return failedAttempts.length >= this.config.auth.maxFailedLoginAttempts;
	}

	/**
	 * Signs up a new user according to the provided data
	 * @param model Dto containing the nescessary data for creating a new user
	 * @returns Id of the created user
	 */
	async signUp(model: SignUpDto): Promise<string> {
		const signUpUserUnit = this.uowFactory.create(true);

		await signUpUserUnit.begin();

		// Trim "0" prefix if exists on phone nr
		if (model.phone.startsWith('0')) {
			model.phone = model.phone.substr(1, model.phone.length);
		}

		// Replace any whitespaces in phone nr
		model.phone = model.phone.replace(/\s+/g, '');

		const [usernameExists, emailExists, phoneExists] = await Promise.all([
			signUpUserUnit.users.usernameExists(model.username),
			signUpUserUnit.users.emailExists(model.email),
			signUpUserUnit.users.phoneExists(model.phone),
		]);

		const identiyErrors: Record<string, string[]> = {};

		// Check if username is already in use
		if (usernameExists) {
			this.logger.warn(
				'Sign up request for an already existing username',
				model.username,
			);

			identiyErrors.username = ['The username is already in use'];
		}

		// Check if email is already in use
		if (emailExists) {
			this.logger.warn(
				'Sign up request for an already existing email',
				model.email,
			);

			identiyErrors.email = ['The email is already in use'];
		}

		if (phoneExists) {
			this.logger.warn(
				'Sign up request for an already existing phone number',
				model.phone,
			);

			identiyErrors.phone = ['The phone number is already in use'];
		}

		// User identity conflict is present (duplicate username, email or phone) => abort with validation error
		if (Object.keys(identiyErrors).length > 0) {
			await signUpUserUnit.rollback();

			throw new ValidationFailedError({
				errors: identiyErrors,
			});
		}

		// Everything is fine => create actual user
		const passwordHash = await this.hashingService.create(model.password);

		const user = new User();
		user.username = model.username;
		user.email = model.email;
		user.password = passwordHash;
		user.phone = model.phone;
		user.tokenVersion = -1; // user hasn't logged in yet => -1

		// Assign user role to new users per default
		const userRole = await signUpUserUnit.roles.getByName(Role.User);
		user.roles = [userRole];

		const createdUser = await signUpUserUnit.users.add(user);

		await signUpUserUnit.commit();

		this.logger.info(`Created account for user "${user.email}"`);

		return createdUser.id;
	}
}
