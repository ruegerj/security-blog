import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@app/alerts';

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
	) {
		this.loginForm = this.createLoginForm();
	}

	ngOnInit(): void {}

	login(): void {
		// Testing only

		console.log(
			'login',
			this.loginForm.get('email')?.value,
			this.loginForm.get('password')?.value,
		);

		this.loggingIn = true;

		setTimeout(() => {
			this.loggingIn = false;
			this.router.navigate(['challenge', 'sms']);
		}, 5000);
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
