import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert, AlertService } from '@app/alerts';
import { AuthenticationService } from '@app/services';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

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

	private alertOptions: Partial<Alert> = {
		id: this.alertId,
	};

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
	) {
		this.smsVerifyForm = this.createForm();
	}

	ngOnInit(): void {}

	verifySms(): void {
		this.verifyingSms = true;

		const code = this.smsCodeControl?.value;

		this.authenticationService
			.verifySmsChallenge(code)
			.pipe(
				switchMap(() => {
					return this.authenticationService.login();
				}),
				catchError((err) => {
					this.alertService.error(err, this.alertOptions);

					// Clear sms code field
					this.smsCodeControl?.setValue('');

					return EMPTY;
				}),
				finalize(() => {
					this.verifyingSms = false;
				}),
			)
			.subscribe(() => {
				let redirectUrl: string =
					this.route.snapshot.queryParams['redirectUrl'] || undefined;

				if (redirectUrl) {
					return this.router.navigateByUrl(redirectUrl);
				}

				return this.router.navigate(['/']);
			});
	}

	resendSms(): void {
		this.sendingSms = true;

		this.authenticationService
			.requestSmsChallenge()
			.pipe(
				tap(() => {
					this.alertService.success('New SMS code has been sendt', {
						...this.alertOptions,
						autoClose: true,
					});
				}),
				catchError((err) => {
					this.alertService.error(
						`Encountered error while sending SMS: ${err}`,
						this.alertOptions,
					);

					return EMPTY;
				}),
				finalize(() => {
					this.sendingSms = false;
				}),
			)
			.subscribe();
	}

	get smsCodeControl() {
		return this.smsVerifyForm.get('smsCode') as FormControl;
	}

	createForm(): FormGroup {
		return this.formBuilder.group({
			smsCode: ['', Validators.required],
		});
	}
}
