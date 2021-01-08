import { Role } from '../enums';

/**
 * Interface for an authenticated user
 */
export interface User {
	/**
	 * Id of the user
	 */
	id: string;

	/**
	 * Email of the user
	 */
	email: string;
	/**
	 * Phone of the user
	 */
	phone: string;

	/**
	 * Collection of the users assigned roles
	 */
	roles: Role[];
}
