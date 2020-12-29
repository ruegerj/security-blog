import { HttpStatusCode } from '@infrastructure/httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Error which should be thrown if someting is wrong with the current request, results in a 400 response
 */
export class BadRequestError extends HttpError {
	constructor(message: string) {
		super(HttpStatusCode.BadRequest, message);
	}
}
