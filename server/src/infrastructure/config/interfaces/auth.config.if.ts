/**
 * Interface for the configuration containing all authentication related settings
 */
export interface IAuthConfig {
	/**
	 * Time window (miliseconds) in which only the specified amount of failed login attempts are allowed
	 */
	loginTimeWindowMS: number;

	/**
	 * The maximal number of failed login attempts within the defined window
	 */
	maxFailedLoginAttempts: number;
}
