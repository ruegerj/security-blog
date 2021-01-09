import { AttemptType, LoginAttempt, User } from '@data-access/entities';
import { UnitOfWorkFactory } from '@data-access/uow/factory';
import { LoginAttemptType } from '@domain/dtos/enums';
import { IConfig } from '@infrastructure/config/interfaces';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import { ILoginAttemptService } from './interfaces';

/**
 * Explicit implementation of `ILoginAttemptService`
 */
@Service({ id: Tokens.ILoginAttemptService })
export class LoginAttemptService implements ILoginAttemptService {
	constructor(
		@Inject(Tokens.IUnitOfWorkFactory)
		private uowFactory: UnitOfWorkFactory,

		@Inject(Tokens.ILogger)
		private logger: ILogger,

		@Inject(Tokens.IConfig)
		private config: IConfig,
	) {}

	/**
	 * Creates a new login attempt corresponding to the given parameters
	 * @param type Type of the attempt which should be created
	 * @param successful Boolean indicating if the attempt was successful
	 * @param userIdentity Email or username with which the attempt was issued
	 */
	async createAttempt(
		type: LoginAttemptType,
		successful: boolean,
		userIdentity?: string,
	): Promise<void> {
		// Try get user for attempt for additional context information
		const user = await this.getUserByIdentiy(userIdentity);

		// If the user cannot be found => indicates failed attempt, dont persist attempt
		if (!user) {
			this.logger.warn('Failed anonymous login attempt');
			return;
		}

		const createAttemptUnit = this.uowFactory.create(true);
		await createAttemptUnit.begin();

		const attempt = new LoginAttempt();
		attempt.timestamp = new Date();
		attempt.successful = successful;
		attempt.type = this.attemptTypeLookup(type);

		attempt.user = user;

		const state = successful ? 'Successful' : 'Failed';

		const loginType =
			type == LoginAttemptType.Login ? 'login' : 'challenge';

		const logMessage = `${state} ${loginType} attempt for user: "${user.email}"`;

		const logMeta = {
			type,
			email: user.email,
			userId: user.id,
		};

		successful
			? this.logger.info(logMessage, logMeta)
			: this.logger.warn(logMessage, logMeta);

		// Store failed attempt in db
		await createAttemptUnit.loginAttempts.add(attempt);

		return createAttemptUnit.commit();
	}

	/**
	 * Checks if the max amount of failed login attempts have been exceeded by the given user
	 * @param userIdentity Email or username of the user for which it should be checked
	 * @param type Optional type of attempts which should be taken in consideration, default is all types
	 * @returns Boolean if the max attempts have been exceeded
	 */
	async loginAttemptsExceeded(
		userIdentity: string,
		type?: LoginAttemptType,
	): Promise<boolean> {
		const user = await this.getUserByIdentiy(userIdentity);

		// No user could be determined uppon identy, no check possible
		if (!user) {
			return false;
		}

		const attemptUnit = this.uowFactory.create(false);
		await attemptUnit.begin();

		// Calculate timestamp for time window
		const unix = Date.now();
		const timelimit = new Date(unix - this.config.auth.loginTimeWindowMS);

		const attemptType =
			type !== undefined ? this.attemptTypeLookup(type) : undefined;

		const failedAttempts = await attemptUnit.loginAttempts.getAllFailedFromUserSince(
			user,
			timelimit,
			attemptType,
		);

		await attemptUnit.commit();

		return failedAttempts.length >= this.config.auth.maxFailedLoginAttempts;
	}

	private async getUserByIdentiy(
		identity: string,
	): Promise<User | undefined> {
		// Credits: https://stackoverflow.com/a/46181
		const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		const getByIdentityUnit = this.uowFactory.create(false);
		await getByIdentityUnit.begin();

		// If matches => user identity is users email
		if (identity?.match(emailRegexp)) {
			return getByIdentityUnit.users.getByEmailWithRoles(identity);
		}

		// User identity is the username
		return getByIdentityUnit.users.getByUsernameWithRoles(identity);
	}

	private attemptTypeLookup(type: LoginAttemptType): AttemptType {
		switch (type) {
			case LoginAttemptType.Login:
				return AttemptType.Login;

			case LoginAttemptType.Challenge:
				return AttemptType.Challenge;

			default:
				throw new Error(`Unsupported login attempt type: ${type}`);
		}
	}
}
