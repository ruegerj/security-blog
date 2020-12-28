/**
 * Interface for the application (express) specific configurations options
 */
export interface IAppConfig {
	/**
	 * Max size a request body can have
	 */
	bodySizeLimit: string;

	/**
	 * Max number of request allowed in the specified time window
	 */
	requestLimitCount: number;

	/**
	 * Time window for which the request limit is applied (in MS)
	 */
	requestLimitWindow: number;

	/**
	 * Max size a log file can have before a new one should be created
	 */
	logfileSize: number;

	/**
	 * Max lag which is allowed for the event loop in ms
	 */
	maxLag: number;

	/**
	 * Path to the directory for storing data (%APPDATA/..) for this application
	 */
	dataLocation: string;
}
