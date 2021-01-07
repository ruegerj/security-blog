import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@app/alerts';
import { AuthenticationService } from '@app/services';
import { EMPTY, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ChallengeType } from 'src/app/data/enums';
import { Credentials } from 'src/app/data/models';

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
			email: this.loginForm.get('email')?.value,
			password: this.loginForm.get('password')?.value,
		};

		this.loggingIn = true;

		this.authenticationService
			.requestChallenge(credentials, ChallengeType.SMS)
			.pipe(
				tap(() => {
					this.router.navigate(['challenge', 'sms']);
				}),
				finalize(() => {
					this.loggingIn = false;
				}),
				catchError((err) => {
					this.alertService.error(err, {
						id: this.alertId,
					});

					return EMPTY;
				}),
			)
			.subscribe();
	}

	getControl(name: string): AbstractControl {
		const control = this.loginForm.get(name);

		if (!control) {
			throw new Error(`No control found with the name: ${name}`);
		}

		return control;
	}

	private createLoginForm(): FormGroup {
		return this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
		});
	}
}
