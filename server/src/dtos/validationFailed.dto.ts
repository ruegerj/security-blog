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
