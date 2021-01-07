import { AlertType } from './alertType.enum';

/**
 * Represents a single alert which can be pushed using the `AlertService`
 */
export class Alert {
	/**
	 * Id of the alert e.g. specifies the areas where the alert shall be displayed
	 */
	id: string = '';

	/**
	 * Type of the alert
	 */
	type: AlertType = AlertType.Info;

	/**
	 * Message the alert carries
	 */
	message!: string;

	/**
	 * Boolean specifying if the alert shall be closed automatically after a spcific amount of time
	 */
	autoClose?: boolean = false;

	/**
	 * Boolean specifying if the alert should be removed if the route changes
	 */
	keepAfterRouteChange?: boolean = false;

	/**
	 * Boolean specifying if the alert should be faded out when closing
	 */
	fade?: boolean = false;

	constructor(init?: Partial<Alert>) {
		Object.assign(this, init);
	}
}
