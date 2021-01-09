/**
 * Interface for a model containing the users credentials
 */
export interface ICredentials {
	/**
	 * Email or username of the user
	 */
	userIdentity: string;

	/**
	 * Plain text password of the user
	 */
	password: string;
}
