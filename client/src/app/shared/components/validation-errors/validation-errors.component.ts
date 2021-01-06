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

	private lookUpError(validatorName: string, validatorValue?: any): string {
		const messageLookup: Record<string, string> = {
			required: 'This field is required.',
			maxLength: `This field can't contain more than ${validatorValue} characters.`,
		};

		return messageLookup[validatorName] || 'Invalid field.';
	}
}
