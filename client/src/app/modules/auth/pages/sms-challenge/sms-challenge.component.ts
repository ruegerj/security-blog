import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert, AlertService } from '@app/alerts';
import { AuthenticationService, ChallengeService } from '@app/services';
import { Role } from '@data/enums';
import { AuthQuery } from '@data/queries';
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
		private authQuery: AuthQuery,
		private challengeService: ChallengeService,
	) {
		this.smsVerifyForm = this.createForm();
	}

	ngOnInit(): void {}

	verifySms(): void {
		// Abort if form invalid
		if (!this.smsVerifyForm.valid) {
			return;
		}

		this.verifyingSms = true;

		// Clear existing alerts
		this.alertService.clear(this.alertId);

		const code = this.smsCodeControl?.value;

		this.challengeService
			.verifySmsChallenge(code)
			.pipe(
				switchMap((verifiedChallenge) => {
					return this.authenticationService.login(
						verifiedChallenge.challengeToken,
					);
				}),
				switchMap(() => {
					let redirectUrl: string =
						this.route.snapshot.queryParams['redirectUrl'] ||
						undefined;

					if (redirectUrl) {
						this.router.navigateByUrl(redirectUrl);
						return EMPTY;
					}

					return this.authQuery.authenticatedUser$;
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
			.subscribe((user) => {
				// About routing due to earlier redirect
				if (!user) {
					return;
				}

				let routeFragments: string[] = [];

				// Navigate to the corresponding dashboard based uppon the users roles
				if (user.roles.includes(Role.Admin)) {
					routeFragments = ['admin', 'dashboard'];
				} else if (user.roles.includes(Role.User)) {
					routeFragments = ['user', 'dashboard'];
				} else {
					routeFragments = ['/'];
				}

				return this.router.navigate(routeFragments);
			});
	}

	resendSms(): void {
		this.sendingSms = true;

		this.challengeService
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
