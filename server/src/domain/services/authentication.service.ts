import { User } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { LoginDto, SignUpDto, TokenResponseDto } from '@domain/dtos';
import { ICredentials } from '@domain/dtos/interfaces';
import {
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
	) {}

	/**
	 * Validates the given login params and log the user in if they are valid
	 * @param model Dto containing all nescessary login parameters
	 * @returns Dto containing both access- and refresh-token for the user
	 */
	async login(model: LoginDto): Promise<TokenResponseDto> {
		const credentialsValid = this.validateCredentials(model);

		// Credentials invalid => abort request
		if (!credentialsValid) {
			// Store failed attempt
			this.loginAttemptService.createAttempt(false, model.email);

			// Abort request as unauthorized
			throw new UnauthorizedError('Invalid credentials');
		}

		const loginUnit = this.uowFactory.create();
		loginUnit.begin();

		const user = await loginUnit.users.getByEmail(model.email);

		// Validate given challenge token
		const validatedChallengeToken = await this.tokenService.verifyChallengeToken(
			model.token,
			user,
		);

		if (!validatedChallengeToken.valid) {
			await loginUnit.rollback();

			// Store failed attempt
			this.loginAttemptService.createAttempt(false, model.email);

			// Abort request as unauthorized
			throw new UnauthorizedError(
				`Invalid challenge token provided, reason: ${validatedChallengeToken.reason}`,
			);
		}

		// Update token version of user
		user.tokenVersion += 1;

		// Credentials and challenge are valid => issue tokens
		const accessToken = await this.tokenService.issueAccessToken(
			user,
			user.roles,
		);

		const refreshToken = await this.tokenService.issueRefreshToken(user);

		await loginUnit.users.update(user);

		await loginUnit.commit();

		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Validates if the given credentials are valid
	 * @param credentials Email and plain password of the user
	 * @returns Boolean if the credentials are valid
	 */
	async validateCredentials(credentials: ICredentials): Promise<boolean> {
		const validateUnit = this.uowFactory.create();
		await validateUnit.begin();

		// Get user by email, validate password
		const user = await validateUnit.users.getByEmail(credentials.email);

		if (!user) {
			await validateUnit.rollback();

			return false;
		}

		// TODO: Check login attempts

		const validPassword = await this.hashingService.verify(
			credentials.password,
			user.password,
		);

		await validateUnit.commit();

		return validPassword;
	}

	/**
	 * Signs up a new user according to the provided data
	 * @param model Dto containing the nescessary data for creating a new user
	 */
	async signUp(model: SignUpDto): Promise<void> {
		const signUpUserUnit = this.uowFactory.create();

		await signUpUserUnit.begin();

		// If email already in use => return validation error
		const emailExists = await signUpUserUnit.users.emailExists(model.email);

		if (emailExists) {
			signUpUserUnit.rollback(); // dispose uow

			throw new ValidationFailedError({
				errors: {
					email: ['The email is already in use'],
				},
			});
		}

		// If phone nr already in use => return validation error
		const phoneExists = await signUpUserUnit.users.phoneExists(model.phone);

		if (phoneExists) {
			signUpUserUnit.rollback(); // Dispose uow

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

		await signUpUserUnit.users.add(user);

		await signUpUserUnit.commit();

		this.logger.info(`Created account for user "${user.email}"`);
	}
}
