import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { AlertService } from '@app/alerts';

@Component({
	selector: 'app-sms-challenge',
	templateUrl: './sms-challenge.component.html',
	styleUrls: ['./sms-challenge.component.scss'],
})
export class SmsChallengeComponent implements OnInit {
	smsVerifyForm: FormGroup;
	sendingSms: boolean = false;
	verifyingSms: boolean = false;
	alertId = 'challenge-alert';

	constructor(
		private formBuilder: FormBuilder,
		private alertService: AlertService,
	) {
		this.smsVerifyForm = this.createForm();
	}

	ngOnInit(): void {}

	verifySms(): void {
		// Testing only
		this.verifyingSms = true;

		setTimeout(() => {
			this.verifyingSms = false;
		}, 4000);
	}

	resendSms(): void {
		// Testing only
		this.sendingSms = true;

		setTimeout(() => {
			this.sendingSms = false;
			this.alertService.success('New SMS code was sendt', {
				id: this.alertId,
			});
		}, 3000);
	}

	getControl(name: string): AbstractControl {
		const control = this.smsVerifyForm.get(name);

		if (!control) {
			throw new Error(`No control found with the name: ${name}`);
		}

		return control;
	}

	createForm(): FormGroup {
		return this.formBuilder.group({
			smsCode: ['', Validators.required],
		});
	}
}