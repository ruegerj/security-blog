import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Checks if the string is a swiss mobile phone number (e.g. starts with _7_ or _07_), should be used in combination with `@IsPhoneNumber("CH")`
 * @param property Property on which the validator should be applied
 * @param validationOptions Optional options for the validation process
 */
export function IsSwissMobileNumber(
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	return (object: Record<string, unknown>, propertyName: string) => {
		registerDecorator({
			name: 'isSwissMobileNumber',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: isSwissMobileNumberValidator,
		});
	};
}

const isSwissMobileNumberValidator: ValidatorConstraintInterface = {
	validate(value: unknown): boolean {
		return (
			typeof value === 'string' &&
			(value.startsWith('7') || value.startsWith('07'))
		);
	},
	defaultMessage(): string {
		return 'The value must be a valid swiss mobile number and therefore start with either "7" or "07"';
	},
};
