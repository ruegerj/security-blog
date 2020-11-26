import { ValidationFailedDto } from '../../dtos';
import { HttpStatusCode } from '../httpStatusCodes';
import { HttpError } from './http.error';

/**
 * Error which should be thrown if the validation of a request has failed
 */
export class ValidationFailedError extends HttpError<ValidationFailedDto> {
	constructor(model: ValidationFailedDto) {
		super(
			HttpStatusCode.UnprocessableEntity,
			'Validation has failed',
			model
		);
	}
}
