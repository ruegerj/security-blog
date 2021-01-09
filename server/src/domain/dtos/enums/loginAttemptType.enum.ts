/**
 * Enum which specifies the type of a login attempt
 */
export enum LoginAttemptType {
	/**
	 * Login failed => user credentials were invalid
	 */
	Login = 0,

	/**
	 * Challenge verification failed => challenge token was invalid
	 */
	Challenge = 1,
}
