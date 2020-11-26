import { HttpStatusCode } from '../httpStatusCodes';

/**
 * Base class for all http errors which should produce an according http error response
 */
export class HttpError<TData = any> extends Error {
	/**
	 * Creates a new HttpError instance
	 * @param status Specific status code which this error should produce
	 * @param message Message of the error
	 * @param data Optional payload for the error
	 */
	constructor(
		public status: HttpStatusCode,
		public message: string,
		public data?: TData
	) {
		super(message);

		// Preserve original stack trace
		Error.captureStackTrace(this, this.constructor);
	}

	/**
	 * Flags this error as expected error (details can be included in response)
	 */
	readonly isOperational = true;
}
