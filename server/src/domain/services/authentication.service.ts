import { User } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { LoginDto, SignUpDto, TokenResponseDto } from '@domain/dtos';
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
			// Store failed attempt
			this.loginAttemptService.createAttempt(false, model.email);

			// Abort request as unauthorized
			throw new UnauthorizedError('Invalid credentials');
		}

		// Validate given challenge token
		const validatedChallengeToken = await this.tokenService.verifyChallengeToken(
			model.token,
			authenticatedUser,
		);

		if (!validatedChallengeToken.valid) {
			// Store failed attempt
			this.loginAttemptService.createAttempt(false, model.email);

			// Abort request as unauthorized
			throw new UnauthorizedError(
				`Invalid challenge token provided, reason: ${validatedChallengeToken.reason}`,
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

		const loginUnit = this.uowFactory.create(true);
		loginUnit.begin();

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

		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Valdiates the given credentials, if valid the corresponding user entity is returned
	 * @param credentials Email and plain password of the user
	 * @returns User if credentials valid, else null
	 */
	async getAuthenticatedUser(credentials: ICredentials): Promise<User> {
		const validateUnit = this.uowFactory.create(false);
		await validateUnit.begin();

		// Get user by email, validate password
		const user = await validateUnit.users.getByEmail(credentials.email);

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

		// If email already in use => return validation error
		const emailExists = await signUpUserUnit.users.emailExists(model.email);

		if (emailExists) {
			await signUpUserUnit.rollback();

			throw new ValidationFailedError({
				errors: {
					email: ['The email is already in use'],
				},
			});
		}

		// If phone nr already in use => return validation error
		const phoneExists = await signUpUserUnit.users.phoneExists(model.phone);

		if (phoneExists) {
			await signUpUserUnit.rollback();

			throw new ValidationFailedError({
				errors: {
					phone: ['The phone number is already in use'],
				},
			});
		}

		// Everything is fine => create actual user
		const passwordHash = await this.hashingService.create(model.password);

		// Trim "0" prefix if exists on phone nr
		if (model.phone.startsWith('0')) {
			model.phone = model.phone.substr(1, model.phone.length);
		}

		const user = new User();
		user.email = model.email;
		user.password = passwordHash;
		user.phone = model.phone;
		user.tokenVersion = -1; // user hasn't logged in yet => -1

		const createdUser = await signUpUserUnit.users.add(user);

		await signUpUserUnit.commit();

		this.logger.info(`Created account for user "${user.email}"`);

		return createdUser.id;
	}
}
