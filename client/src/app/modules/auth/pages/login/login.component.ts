import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;

	constructor(private formBuilder: FormBuilder) {
		this.loginForm = this.createLoginForm();
	}

	ngOnInit(): void {}

	login(): void {
		console.log(
			'login',
			this.loginForm.get('email')?.value,
			this.loginForm.get('password')?.value,
		);
	}

	getControl(name: string): AbstractControl {
		const control = this.loginForm.get(name);

		if (!control) {
			throw new Error('No such control found');
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
