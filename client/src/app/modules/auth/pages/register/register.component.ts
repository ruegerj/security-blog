import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import {
	Digits,
	LowercaseCharacters,
	PasswordsMatch,
	SpecialCharacters,
	SwissMobilePhoneNumber,
	UppercaseCharacters,
} from '@shared/validators';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	registering: boolean = false;

	alertId = 'register-alert';

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.registerForm = this.createForm();
	}

	register(): void {}

	// Form Helpers

	get usernameControl(): FormControl {
		return this.registerForm.get('username') as FormControl;
	}

	get emailControl(): FormControl {
		return this.registerForm.get('email') as FormControl;
	}

	get passwordControl(): FormControl {
		return this.registerForm.get('password') as FormControl;
	}

	get passwordConfirmControl(): FormControl {
		return this.registerForm.get('passwordConfirm') as FormControl;
	}

	get phoneControl(): FormControl {
		return this.registerForm.get('phone') as FormControl;
	}

	private createForm(): FormGroup {
		return this.formBuilder.group(
			{
				username: [
					'',
					[
						Validators.required,
						Validators.minLength(3),
						Validators.maxLength(15),
					],
				],
				email: ['', [Validators.required, Validators.email]],
				phone: ['', [Validators.required, SwissMobilePhoneNumber()]],
				password: [
					'',
					[
						Validators.required,
						Validators.minLength(10),
						LowercaseCharacters(),
						UppercaseCharacters(),
						Digits(),
						SpecialCharacters(),
					],
				],
				passwordConfirm: ['', [Validators.required]],
			},
			{
				validators: [PasswordsMatch('password', 'passwordConfirm')],
			},
		);
	}
}
