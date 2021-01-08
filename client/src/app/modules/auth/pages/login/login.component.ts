import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@app/alerts';
import { AuthenticationService } from '@app/services';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Credentials } from '@data/models';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loggingIn: boolean = false;

	alertId = 'login-alert';

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
	) {
		this.loginForm = this.createLoginForm();
	}

	ngOnInit(): void {}

	login(): void {
		const credentials: Credentials = {
			email: this.emailControl?.value,
			password: this.passwordControl?.value,
		};

		// Clear existing alerts
		this.alertService.clear(this.alertId);

		this.loggingIn = true;

		this.authenticationService.setCredentials(credentials);

		this.authenticationService
			.requestSmsChallenge()
			.pipe(
				tap(() => {
					this.router.navigate(['challenge', 'sms']);
				}),
				catchError((err) => {
					this.alertService.error(err, {
						id: this.alertId,
					});

					// Clear password field
					this.passwordControl?.setValue('');

					return EMPTY;
				}),
				finalize(() => {
					this.loggingIn = false;
				}),
			)
			.subscribe();
	}

	get emailControl() {
		return this.loginForm.get('email') as FormControl;
	}

	get passwordControl() {
		return this.loginForm.get('password') as FormControl;
	}

	private createLoginForm(): FormGroup {
		return this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
		});
	}
}
