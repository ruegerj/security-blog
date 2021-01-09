/**
 * Interface for the payload of a validation failed response
 */
export class ValidationErrors {
	constructor(errors: Record<string, string[]>) {
		this.errors = errors;
	}

	/**
	 * Object whose keys represent the field for whose the validation has failed, the value of the properties are the error messages of the validation
	 */
	errors: Record<string, string[]>;
}
