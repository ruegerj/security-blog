import { SmsToken } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { IUnitOfWork } from '@data-access/uow/interfaces';
import { ICredentials } from '@domain/dtos/interfaces';
import { IConfig } from '@infrastructure/config/interfaces';
import { UnauthorizedError } from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import {
	IAuthenticationService,
	IChallengeService,
	ILoginAttemptService,
	ISmsService,
} from './interfaces';

/**
 * Explicit implementation of `IChallengeService`
 */
@Service({ id: Tokens.IChallengeService })
export class ChallengeService implements IChallengeService {
	constructor(
		@Inject(Tokens.IAuthenticationService)
		private authenticationService: IAuthenticationService,

		@Inject(Tokens.ILoginAttemptService)
		private loginAttemptService: ILoginAttemptService,

		@Inject(Tokens.ISmsService)
		private smsService: ISmsService,

		@Inject(Tokens.IUnitOfWorkFactory)
		private uowFactory: IUnitOfWorkFactory,

		@Inject(Tokens.IConfig)
		private config: IConfig,

		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {}

	/**
	 * Creates a SMS challenge for the given user (if exists and credentials are correct)
	 * @param credentials Credentials of the user who requests the challenge
	 */
	async requestSmsChallenge(credentials: ICredentials): Promise<void> {
		const authenticatedUser = await this.authenticationService.getAuthenticatedUser(
			credentials,
		);

		// Invalid credentials => abort request
		if (!authenticatedUser) {
			// Store failed attempt
			this.loginAttemptService.createAttempt(false, credentials.email);

			// Abort request as unauthorized
			throw new UnauthorizedError('Invalid credentials');
		}

		// Check if attempts have been exceeded
		const attempsExceeded = await this.authenticationService.loginAttemptsExceeded(
			authenticatedUser,
		);

		if (attempsExceeded) {
			const windowMinutes =
				this.config.auth.loginTimeWindowMS / 1000 / 60;

			// Abort request as unauthorized
			throw new UnauthorizedError(
				`Too many failed login requests. Try again in ${windowMinutes} minutes`,
			);
		}

		let challengeUnit: IUnitOfWork;

		try {
			challengeUnit = this.uowFactory.create(true);
			await challengeUnit.begin();

			// Create & store sms code in db
			const challengeCode = this.createSmsCode(
				this.config.challenge.smsCodeLength,
			);

			const token = new SmsToken();
			token.issuedAt = new Date();
			token.redeemed = false;
			token.token = challengeCode;
			token.user = authenticatedUser;

			await challengeUnit.smsTokens.add(token);

			// Send actual SMS to user
			const smsText = this.createSmsText(challengeCode);

			await this.smsService.send(smsText, authenticatedUser.phone);

			// Commit changes if token could be sendt successfuly
			await challengeUnit.commit();
		} catch (error) {
			this.logger.error(
				'Encountered error while sending sms code',
				error,
			);

			// Attempt rollback
			await challengeUnit?.rollback();

			// Rethrow error so request fails
			throw error;
		}
	}

	/**
	 * Creates the text which should be sendt within the sms
	 * @param code Sms code which should be included in the message
	 */
	private createSmsText(code: string): string {
		const validForMinutes = this.config.challenge.smsTokenValidFor / 60;

		return `Login @Security-Blog\nYour SMS token is: ${code}\nPlease note that this token is only valid for ${validForMinutes} minutes.`;
	}

	/**
	 * Creates a new SMS code of the given length
	 * @param length Lenght the code should have, must be greater than zero
	 */
	private createSmsCode(length: number): string {
		if (length <= 0) {
			throw new RangeError(
				'SMS code lenght cannot be smaller or equal to zero',
			);
		}

		const possibleDigits = '0123456789';
		const codeDigits: string[] = [];

		for (let i = 0; i < length; i++) {
			const digit = possibleDigits.charAt(
				Math.floor(Math.random() * possibleDigits.length),
			);

			codeDigits.push(digit);
		}

		return codeDigits.join('');
	}
}
