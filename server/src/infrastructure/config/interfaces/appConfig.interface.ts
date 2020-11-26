/**
 * Interface for the application (express) specific configurations options
 */
export interface IAppConfig {
	/**
	 * Max size a request body can have
	 */
	bodySizeLimit: string;
}
