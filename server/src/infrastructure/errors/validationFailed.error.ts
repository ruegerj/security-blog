import { HttpStatusCode } from '../httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Error which should be thrown if the validation of a request has failed, results in a 422 response
 */
export class ValidationFailedError extends HttpError<ValidationFailedDto> {
	constructor(model: ValidationFailedDto) {
		super(
			HttpStatusCode.UnprocessableEntity,
			'Validation has failed',
			model,
		);
	}
}

/**
 * Dto for a response when the validation has failed
 */
export class ValidationFailedDto {
	/**
	 * Object key: name of the field whose validation has failed
	 *        value: Array of validation errors for this field
	 */
	errors: Record<string, string[]>;
}
