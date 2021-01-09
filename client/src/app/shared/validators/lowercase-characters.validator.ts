import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Returns validator which checks if the control contains atleast one lowercase char
 */
export function LowercaseCharacters(): ValidatorFn {
	const lowercaseCharRegexp = /[a-z]{1,}/;

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
		if (control.value.match(lowercaseCharRegexp)) {
			return null;
		}

		// Invalid => control value doesn't contain any lowercase chars
		return {
			lowercaseChars: true,
		};
	};
}
