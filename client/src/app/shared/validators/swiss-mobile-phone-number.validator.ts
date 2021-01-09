import { AbstractControl, ValidatorFn } from '@angular/forms';

// Credits (Regexp): https://stackoverflow.com/a/59641805

/**
 * Returns a validator which checks if the control value is a valid swiss mobile phone number
 *
 *
 * Accepted formats:
 * - 7x xxx xx xx
 * - 7xxxxxxxx
 * - 07x xxx xx xx
 * - 07xxxxxxxx
 */
export function SwissMobilePhoneNumber(): ValidatorFn {
	const swissMobilePhoneRegex = /\b(0)?7[1-9]{1}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/;

	return (control: AbstractControl): Record<string, boolean> | null => {
		// Valid => no control or value to check
		if (!control?.value) {
			return null;
		}

		// Valid => control value is no string
		if (typeof control.value !== 'string') {
			return null;
		}

		// Valid => control value matches expected pattern
		if (control.value.match(swissMobilePhoneRegex)) {
			return null;
		}

		// Invalid => control value doesn't match the expected pattern
		return {
			invalidPhoneNumber: true,
		};
	};
}
