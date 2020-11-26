import { plainToClass } from 'class-transformer';
import { validate as classValidate } from 'class-validator';
import { RequestHandler } from 'express';
import { ValidationFailedError } from '../errors';

/**
 * Returns middleware function which validates the request body according to the validation specifications from TModel
 * @param type Type of the model which should be validated
 * @param skipMissingProperties Specifies if missing properties in the body should be skippe (default is false)
 */
export function validate<TModel>(
	type: any,
	skipMissingProperties = false
): RequestHandler {
	return async (req, res, next) => {
		const parsedBody = plainToClass<TModel, unknown>(type, req.body);

		const errors = await classValidate(parsedBody, {
			skipMissingProperties,
		});

		// Validation successful => continue
		if (errors.length == 0) {
			return next();
		}

		const errorRecord: Record<string, string[]> = {};

		for (const validationError of errors) {
			errorRecord[validationError.property] = Object.values(
				validationError.constraints
			);
		}

		// Delegate validation error to global exception handler
		next(
			new ValidationFailedError({
				errors: errorRecord,
			})
		);
	};
}
