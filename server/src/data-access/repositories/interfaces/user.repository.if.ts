import { IRepository } from '@data-access/repositories/interfaces';
import { User } from '../../entities/user';

/**
 * Interface for all repository implementations for the `User` entity
 */
export interface IUserRepository extends IRepository<User> {
	/**
	 * Should check if the given email already exists on one of the users
	 * @param email Email address to check
	 * @returns Boolean if the email exists
	 */
	emailExists(email: string): Promise<boolean>;

	/**
	 * Should check if the given phone number already exists on one of the users
	 * @param phone Phone number to check
	 * @returns Boolean if the phone number exists
	 */
	phoneExists(phone: string): Promise<boolean>;

	/**
	 * Should return the user with the corresponding email
	 * @param email Email for which the user should be found for
	 * @returns Found user or null
	 */
	getByEmail(email: string): Promise<User>;
}
