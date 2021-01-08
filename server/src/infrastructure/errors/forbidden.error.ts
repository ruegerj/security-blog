import { HttpStatusCode } from '@infrastructure/httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Should be thrown if the current operation if forbidden for the current user due to the lack of permissions, results in a 403 response
 */
export class ForbiddenError extends HttpError {
	constructor(message?: string) {
		super(HttpStatusCode.Forbidden, message);
	}
}
