/**
 * Interface for the server specific configuration options
 */
export interface IServerConfig {
	/**
	 * Hostname of the server
	 */
	hostname: string;

	/**
	 * Port of the server
	 */
	port: number;

	/**
	 * Path to appdata dir on the current host
	 */
	appDataLocation: string;
}
