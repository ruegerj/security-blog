import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert } from './alert';
import { AlertType } from './alertType.enum';

// Credits: https://jasonwatmore.com/post/2020/07/16/angular-10-alert-notifications-example

/**
 * Application wide service used for pushing new alerts which should be displayed
 */
@Injectable({
	providedIn: 'root',
})
export class AlertService {
	private subject = new ReplaySubject<Alert>();

	/**
	 * Default id which is used for the alerts, when nothing different specified
	 */
	static globalId = 'global-alert';

	/**
	 * Hook for subcribing to all new alerts
	 * @param id Optional id which is applied as filter to provide only alerts whith this specific id, default is the global id for alerts
	 */
	onAlert(id: string = AlertService.globalId): Observable<Alert> {
		return this.subject
			.asObservable()
			.pipe(filter((a) => a && a.id === id));
	}

	/**
	 * Pushes a new alert of the type `Success` to the subscribers
	 * @param message Message the alert should have
	 * @param options Optional construction options for the alert
	 */
	success(message: string, options?: Partial<Alert>): void {
		this.alert(
			new Alert({
				...options,
				message,
				type: AlertType.Success,
			}),
		);
	}

	/**
	 * Pushes a new alert of the type `Info` to the subscribers
	 * @param message Message the alert should have
	 * @param options Optional construction options for the alert
	 */
	info(message: string, options?: Partial<Alert>): void {
		this.alert(
			new Alert({
				...options,
				message,
				type: AlertType.Info,
			}),
		);
	}

	/**
	 * Pushes a new alert of the type `Warning` to the subscribers
	 * @param message Message the alert should have
	 * @param options Optional construction options for the alert
	 */
	warn(message: string, options?: Partial<Alert>): void {
		this.alert(
			new Alert({
				...options,
				message,
				type: AlertType.Warning,
			}),
		);
	}

	/**
	 * Pushes a new alert of the type `Error` to the subscribers
	 * @param message Message the alert should have
	 * @param options Optional construction options for the alert
	 */
	error(message: string, options?: Partial<Alert>): void {
		this.alert(
			new Alert({
				...options,
				autoClose: false,
				message,
				type: AlertType.Error,
			}),
		);
	}

	/**
	 * Pushes the given alert to the subscribers
	 * @param alert Alert obj which should be pushed
	 */
	alert(alert: Alert): void {
		alert.id = alert.id || AlertService.globalId;

		this.subject.next(alert); // Push alert to subscribers
	}

	/**
	 * Clears all alerts issued uppon this point
	 * @param id Optional id specifying the excact group of alerts which should be cleared, default is the global id for alerts
	 */
	clear(id: string = AlertService.globalId): void {
		// Push alert only containing an id => singal to subscribers to clear all received alerts
		this.subject.next(new Alert({ id }));
	}
}
