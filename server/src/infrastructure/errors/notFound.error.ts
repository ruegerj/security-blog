import { HttpStatusCode } from '@infrastructure/httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Error which should be thrown if a resource couldn't be found, results in a 404 response
 */
export class NotFoundError extends HttpError {
	constructor(message?: string) {
		super(HttpStatusCode.NotFound, message);
	}
}
