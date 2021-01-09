import { AbstractControl, ValidatorFn } from '@angular/forms';

// Credits: https://itnext.io/angular-custom-form-validation-bc513b45ccfa

/**
 * Returns a validator which checks if the values of the given to fields match
 * @param passwordKey Name of the password control
 * @param passwordConfirmKey Name of the password confirm control
 */
export function PasswordsMatch(
	passwordKey: string,
	passwordConfirmKey: string,
): ValidatorFn {
	return (control: AbstractControl): Record<string, boolean> | null => {
		// Valid => control not available
		if (!control) {
			return null;
		}

		const password = control.get(passwordKey);
		const passwordConfirm = control.get(passwordConfirmKey);

		// Valid => one of the values is undefined
		if (!password?.value || !passwordConfirm?.value) {
			return null;
		}

		// Valid => values match
		if (password.value === passwordConfirm.value) {
			return null;
		}

		// Invalid => values don't match
		return {
			passwordMismatch: true,
		};
	};
}
