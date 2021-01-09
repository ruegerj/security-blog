import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
	selector: 'app-validation-errors',
	templateUrl: './validation-errors.component.html',
	styleUrls: ['./validation-errors.component.scss'],
})
export class ValidationErrorsComponent {
	@Input()
	control!: AbstractControl;

	get errorMessage(): string | undefined {
		for (const property in this.control.errors) {
			if (
				this.control.errors.hasOwnProperty(property) &&
				this.control.touched
			) {
				return this.lookUpError(
					property,
					this.control.errors[property],
				);
			}
		}

		return undefined;
	}

	private lookUpError(
		validatorName: string,
		validatorValue?: Record<string, unknown>,
	): string {
		const messageLookup: Record<string, string> = {
			required: 'This field is required.',
			minlength: `This field must contain atleast: ${
				validatorValue?.requiredLength || 'n/a'
			} characters`,
			maxlength: `This field can't contain more than ${
				validatorValue?.requiredLength || 'n/a'
			} characters.`,
			email: 'This field is not a valid email address.',
			passwordMismatch: 'The password fields do not match.',
			invalidPhoneNumber: 'This field is not a valid phone number.',
			lowercaseChars:
				'This field must contain atleast one lowercase character (a-z).',
			uppercaseChars:
				'This field must contain atleast one uppercase character (A-Z).',
			digits: 'This field must contain atleast one digit (0-9).',
			specialChars:
				'This field must contain atleast one special character.',
			inUse: 'This value is already in use, choose a different one.',
		};

		return messageLookup[validatorName] || 'Invalid field.';
	}
}
