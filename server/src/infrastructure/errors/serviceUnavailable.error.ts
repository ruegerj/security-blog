import { HttpStatusCode } from '../httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Error which should be thrown if the app (service) is unavailable, results in a 503 response
 */
export class ServiceUnavailableError extends HttpError {
	constructor(message: string) {
		super(HttpStatusCode.ServiceUnavailable, message);
	}
}
