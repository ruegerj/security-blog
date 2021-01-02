import fetch from 'node-fetch';
import { Inject, Service } from 'typedi';
import { IConfig } from '@infrastructure/config/interfaces';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { ISmsService } from './interfaces';

/**
 * Explicit implementation using the external M183 SMS provider
 */
@Service({ id: Tokens.ISmsService })
export class SmsService implements ISmsService {
	constructor(
		@Inject(Tokens.IConfig)
		private config: IConfig,

		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {}

	/**
	 * Sends the given message to the given number as a sms
	 * @param message Message of the sms
	 * @param number Phone number to which the sms shall be sendt
	 */
	async send(message: string, number: string): Promise<void> {
		const requestUrl = `${this.config.challenge.smsApiBaseUrl}/api/sms/message`;

		// SMS provider request format "417xxxxxxx" => prefix with 41
		if (!number.startsWith('41')) {
			number = `41${number}`;
		}

		const body = {
			message,
			mobileNumber: number,
		};

		const response = await fetch(requestUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': this.config.challenge.smsApiToken,
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			this.logger.error(
				`SMS send request failed for number "${number}"`,
				number,
				response.status,
				response.statusText,
			);

			throw new Error(`Failed to send SMS to number: ${number}`);
		}
	}
}
