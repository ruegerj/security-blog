import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@app/alerts';
import { AuthenticationService, ChallengeService } from '@app/services';
import { SignUpUser, ValidationErrors } from '@data/models';
import {
	Digits,
	LowercaseCharacters,
	PasswordsMatch,
	SpecialCharacters,
	SwissMobilePhoneNumber,
	UppercaseCharacters,
} from '@shared/validators';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	registering: boolean = false;

	alertId = 'register-alert';

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authenticationService: AuthenticationService,
		private challengeService: ChallengeService,
		private alertService: AlertService,
	) {}

	ngOnInit(): void {
		this.registerForm = this.createForm();
	}

	register(): void {
		// Abort if form invalid
		if (!this.registerForm.valid) {
			return;
		}

		this.registering = true;

		this.alertService.clear(this.alertId);

		const user: SignUpUser = {
			username: this.usernameControl?.value,
			email: this.emailControl?.value,
			phone: this.phoneControl?.value,
			password: this.passwordControl?.value,
		};

		this.authenticationService
			.register(user)
			.pipe(
				switchMap(() => {
					// Register credentials for login process
					this.authenticationService.setCredentials({
						userIdentity: user.email,
						password: user.password,
					});

					return this.challengeService.requestSmsChallenge();
				}),
				catchError((err) => {
					// Handle validation errors
					if (err instanceof ValidationErrors) {
						return this.applyValidationErrors(err);
					}

					// Handle all other potential errors
					this.alertService.error(err, {
						id: this.alertId,
						autoClose: false,
					});

					return EMPTY;
				}),
				finalize(() => {
					this.registering = false;
				}),
			)
			.subscribe(() => {
				// Proceed to challenge verification
				this.router.navigate(['challenge', 'sms']);
			});
	}

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

	/**
	 * Applies the given validation errors to the register form controls
	 * @param validationErrors Valdiation errors received from the api
	 */
	private applyValidationErrors(
		validationErrors: ValidationErrors,
	): Observable<void> {
		const fieldKeys = Object.keys(validationErrors?.errors || {});

		for (const key of fieldKeys) {
			const control = this.registerForm.get(key);

			if (!control) {
				continue;
			}

			const errors = validationErrors.errors[key];

			// TODO: Add more sophisticated solution
			// Already in use error exists => apply to control
			if (errors.some((e) => e.toLowerCase().includes('in use'))) {
				control.setErrors({
					inUse: true,
				});
			}
		}

		this.alertService.error('Validation failed', {
			id: this.alertId,
			autoClose: false,
		});

		return EMPTY;
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
