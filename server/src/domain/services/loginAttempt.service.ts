import { LoginAttempt } from '@data-access/entities';
import { UnitOfWorkFactory } from '@data-access/uow/factory';
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
	) {}

	/**
	 * Creates a new login attempt corresponding to the given parameters
	 * @param successful Boolean indicating if the attempt was successful
	 * @param email Email with which the attempt was issued
	 */
	async createAttempt(successful: boolean, email?: string): Promise<void> {
		const createAttemptUnit = this.uowFactory.create();
		await createAttemptUnit.begin();

		const attempt = new LoginAttempt();
		attempt.timestamp = new Date();
		attempt.successful = successful;

		// Try get user for attempt for additional context information
		const user = await createAttemptUnit.users.getByEmail(email);

		if (user) {
			attempt.user = user;

			const logMessage = `${
				successful ? 'Successful' : 'Failed'
			} login attempt for user: "${user.email}"`;

			const logMeta = {
				email: user.email,
				userId: user.id,
			};

			successful
				? this.logger.info(logMessage, logMeta)
				: this.logger.warn(logMessage, logMeta);
		} else {
			// If the user cannot be found => indicates failed attempt
			this.logger.warn('Failed anonymous login attempt');
		}

		// Store failed attempt in db
		await createAttemptUnit.loginAttempts.add(attempt);

		return createAttemptUnit.commit();
	}
}
