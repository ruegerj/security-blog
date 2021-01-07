import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Alert, AlertService, AlertType } from '@app/alerts';

// Credits: https://jasonwatmore.com/post/2020/07/16/angular-10-alert-notifications-example

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
	/**
	 * Id which specifies which alerts this component should be displaying
	 */
	@Input()
	alertId = AlertService.globalId;

	/**
	 * Specifies if the alerts should be faded out when closed
	 */
	@Input()
	fade = true;

	/**
	 * Timeout (im MS) which should be applied for all alerts whith the 'autoClose' flag set
	 */
	@Input()
	autoCloseTimeout = 3000;

	private alertSubscription!: Subscription;
	private routeSubscription!: Subscription;

	alerts: Alert[] = [];

	constructor(private router: Router, private alertService: AlertService) {}

	ngOnInit(): void {
		// Subscribe for alerts and route changes
		this.alertSubscription = this.subscribeForAlerts();
		this.routeSubscription = this.subscribeForRouteChanges();
	}

	ngOnDestroy(): void {
		// Unsubscribe to avoid memory leaks
		this.alertSubscription.unsubscribe();
		this.routeSubscription.unsubscribe();
	}

	/**
	 * Removes the given alert from the local collection
	 * @param alert Alert which should be removed
	 */
	removeAlert(alert: Alert) {
		// Check if already removed to prevent error on auto close
		if (!alert || !this.alerts.includes(alert)) {
			return;
		}

		if (this.fade) {
			const localAlert = this.alerts.find((a) => a === alert);

			if (!localAlert) {
				return;
			}

			// Fade out alert
			localAlert.fade = true;

			// Remove alert after faded out
			setTimeout(() => {
				this.alerts = this.alerts.filter((x) => x !== alert);
			}, 250);
		} else {
			// Remove alert
			this.alerts = this.alerts.filter((x) => x !== alert);
		}
	}

	/**
	 * Clears all local alerts which doesn't have the 'keepAfterRouteChange' flag set
	 */
	clear(): void {
		// Filter out all alerts without 'keepAfterRouteChange' flag
		this.alerts = this.alerts.filter((a) => a.keepAfterRouteChange);

		// Remove 'keepAfterRouteChange' flag on remaining alerts
		this.alerts.forEach((a) => delete a.keepAfterRouteChange);
	}

	/**
	 * Helper which returns the corresponding css class(es) for the given alert
	 * @param alert Alert whose css class(es) are requested
	 */
	buildAlertClass(alert: Alert): string {
		if (!alert) {
			return '';
		}

		const classes = ['alert', 'alert-dismissable'];

		const alertTypeClass = {
			[AlertType.Success]: 'alert-success',
			[AlertType.Error]: 'alert-danger',
			[AlertType.Info]: 'alert-info',
			[AlertType.Warning]: 'alert-warning',
		};

		classes.push(alertTypeClass[alert.type]);

		if (alert.fade) {
			classes.push('fade');
		}

		return classes.join(' ');
	}

	/**
	 * Returns a subscription for incoming alerts
	 */
	private subscribeForAlerts(): Subscription {
		return this.alertService.onAlert(this.alertId).subscribe((alert) => {
			// Clear local alerts when signal e.g. empty alert is received
			if (!alert.message) {
				return this.clear();
			}

			this.alerts.push(alert);

			// Add timeout for autoclose, if required
			if (alert.autoClose) {
				setTimeout(
					() => this.removeAlert(alert),
					this.autoCloseTimeout,
				);
			}
		});
	}

	/**
	 * Returns a subscription for route changes, which clears the local alerts
	 */
	private subscribeForRouteChanges(): Subscription {
		return this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.alertService.clear(this.alertId);
			}
		});
	}
}
