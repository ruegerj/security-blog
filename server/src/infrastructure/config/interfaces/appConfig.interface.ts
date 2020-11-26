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
}
