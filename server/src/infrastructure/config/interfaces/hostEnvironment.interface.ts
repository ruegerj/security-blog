/**
 * Interface for an host environment
 */
export interface IHostEnvironment {
	/**
	 * Name of the environment
	 */
	name: string;

	/**
	 * Should specify if the this is the development environment
	 */
	isDevelopment: boolean;

	/**
	 * Should specify if the this is the testing environment
	 */
	isTesting: boolean;

	/**
	 * Should specify if the this is the production environment
	 */
	isProduction: boolean;
}
