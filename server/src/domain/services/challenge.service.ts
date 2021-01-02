import { SmsToken } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { IUnitOfWork } from '@data-access/uow/interfaces';
import { ChallengeVerifyDto } from '@domain/dtos';
import { ChallengeType } from '@domain/dtos/enums';
import { ICredentials } from '@domain/dtos/interfaces';
import { IConfig } from '@infrastructure/config/interfaces';
import {
	BadRequestError,
	TooManyRequestsError,
	UnauthorizedError,
} from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import {
	IAuthenticationService,
	IChallengeService,
	ILoginAttemptService,
	ISmsService,
	ITokenService,
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

		@Inject(Tokens.ITokenService)
		private tokenService: ITokenService,

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
	 * @returns Id of the issued sms token
	 */
	async requestSmsChallenge(credentials: ICredentials): Promise<string> {
		const authenticatedUser = await this.authenticationService.getAuthenticatedUser(
			credentials,
		);

		// Invalid credentials => abort request
		if (!authenticatedUser) {
			// TODO: Store failed attempt
			// this.loginAttemptService.createAttempt(false, credentials.email);

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

			this.logger.warn(
				'Blocked challenge request due to too many failed login attempts',
				authenticatedUser.email,
			);

			throw new TooManyRequestsError(
				`Too many failed login requests. Try again in ${windowMinutes} minutes`,
				windowMinutes * 60,
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

			const addedToken = await challengeUnit.smsTokens.add(token);

			// Send actual SMS to user
			const smsText = this.createSmsText(challengeCode);

			await this.smsService.send(smsText, authenticatedUser.phone);

			// Commit changes if token could be sendt successfuly
			await challengeUnit.commit();

			return addedToken.id;
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
	 * Verifies the given sms token and the additionaly provided data (e.g. credentials)
	 * @param model Dto containing the nescesary data for verifying the challenge token
	 * @returns A challenge token which confirms the validity of the second factor
	 */
	async verifySmsChallenge(model: ChallengeVerifyDto): Promise<string> {
		const authenticatedUser = await this.authenticationService.getAuthenticatedUser(
			model,
		);

		// Invalid credentials => abort request
		if (!authenticatedUser) {
			// TODO: Store failed attempt
			// this.loginAttemptService.createAttempt(false, model.email);

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

			this.logger.warn(
				'Blocked challenge verify due to too many failed login attempts',
				authenticatedUser.email,
			);

			throw new TooManyRequestsError(
				`Too many failed login requests. Try again in ${windowMinutes} minutes`,
				windowMinutes * 60,
			);
		}

		let challengeUnit: IUnitOfWork;

		try {
			challengeUnit = this.uowFactory.create(true);
			await challengeUnit.begin();

			const latestToken = await challengeUnit.smsTokens.getLastestForUser(
				authenticatedUser,
			);

			const smsToken = await challengeUnit.smsTokens.getById(
				model.challengeId,
			);

			if (!smsToken) {
				// TODO: Register failed request
				throw new BadRequestError('Invalid challenge id');
			}

			// Check if provided token is latest token issued
			if (smsToken.id != latestToken.id) {
				// TODO: Reqister failed request
				throw new BadRequestError(
					'Challenge expired, a new sms token was issued in the meantime',
				);
			}

			// Check if tokens match
			if (model.token !== smsToken.token) {
				// TODO: Register failed requst
				throw new BadRequestError('Invalid sms token');
			}

			// Check if token was already redeemed
			if (smsToken.redeemed) {
				// TODO: Reqister failed request
				throw new BadRequestError('SMS token was already redeemed');
			}

			// Check if token has expired
			const expiryDate =
				smsToken.issuedAt.valueOf() +
				this.config.challenge.smsTokenValidFor;

			const now = new Date().valueOf();

			if (now >= expiryDate) {
				// TODO: Reqister failed request
				throw new BadRequestError('SMS token has expired');
			}

			// Redeem token
			smsToken.redeemed = true;

			await challengeUnit.smsTokens.update(smsToken);

			const challengeToken = await this.tokenService.issueChallengeToken(
				authenticatedUser,
				ChallengeType.SMS,
			);

			await challengeUnit.commit();

			return challengeToken;
		} catch (error) {
			this.logger.error(
				'Encountered error while verifying sms token',
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
		const validForMinutes =
			this.config.challenge.smsTokenValidFor / 1000 / 60;

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
