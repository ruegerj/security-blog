/**
 * Interface for the credentials of an user
 */
export interface Credentials {
	/**
	 * Email or username of the user
	 */
	userIdentity: string;

	/**
	 * Plain text password of the user
	 */
	password: string;
}
