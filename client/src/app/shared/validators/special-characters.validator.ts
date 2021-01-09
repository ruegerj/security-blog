import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Returns validator which checks if the control value contains atleast one special character
 */
export function SpecialCharacters(): ValidatorFn {
	const specialCharRegexp = /[~!@#$%^&*_\-+=`\-|\\(){}\[\]:;"'<>,.?/]{1,}/;

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
		if (control.value.match(specialCharRegexp)) {
			return null;
		}

		// Invalid => control value doesn't contain any lowercase chars
		return {
			specialChars: true,
		};
	};
}
