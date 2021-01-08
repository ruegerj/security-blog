import { Credentials } from '@data/models';

/**
 * Represents the credentials state for the application
 */
export type CredentialsState = {
	/**
	 * Temporary state for the credentials the user enters during the login process
	 */
	credentials: Credentials | null;

	/**
	 * Access token which is used for authentication on the backend api
	 */
	accessToken: {
		/**
		 * Raw access token (JWT)
		 */
		token: string;

		/**
		 * Date when the access token will expire
		 */
		expiresAt: Date;
	} | null;
};
