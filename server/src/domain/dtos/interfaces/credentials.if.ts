/**
 * Interface for a model containing the users credentials
 */
export interface ICredentials {
	/**
	 * Email of the user
	 */
	email: string;

	/**
	 * Plain text password of the user
	 */
	password: string;
}
