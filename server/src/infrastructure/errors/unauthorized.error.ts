import { HttpStatusCode } from '@infrastructure/httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Error which should be thrown if the current user is unauthorized, results in a 401 response
 */
export class UnauthorizedError extends HttpError {
	constructor(message?: string) {
		super(HttpStatusCode.Unauthorized, message);
	}
}
