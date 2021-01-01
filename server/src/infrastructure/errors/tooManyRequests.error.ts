import { HttpStatusCode } from '@infrastructure/httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Error which should be thrown if a certain request limit has been reached, results in a 429 response
 */
export class TooManyRequestsError extends HttpError<TooManyRequestsPayload> {
	constructor(message: string, timeoutSeconds: number) {
		super(HttpStatusCode.TooManyRequests, message, {
			retryAfter: timeoutSeconds,
		});
	}
}

/**
 * Payload which is included in a `TooManyRequestsError`
 */
export interface TooManyRequestsPayload {
	/**
	 * Number of seconds after which the request count will be reset and request are permitted again
	 */
	retryAfter: number;
}
