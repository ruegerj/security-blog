import { IToken } from './token.if';

/**
 * Interface for an access token which is issued for an user
 */
export interface IAccessToken extends IToken {
	/**
	 * Email of the user
	 */
	email: string;

	/**
	 * Phone number of the user
	 */
	phone: string;

	/**
	 * Array of all roles assigned to the user (role names)
	 */
	roles: string[];
}
