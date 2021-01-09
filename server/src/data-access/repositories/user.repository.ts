import { User } from '@data-access/entities';
import { IUserRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `IUserRepository`
 */
export class UserRepository
	extends RepositoryBase<User>
	implements IUserRepository {
	/**
	 * Checks if the given username already exists on one of the users
	 * @param username Username to check
	 * @returns Boolean if the username exists
	 */
	async usernameExists(username: string): Promise<boolean> {
		const foundUser = await this.repository.findOne({ username });

		return foundUser !== undefined;
	}

	/**
	 * Checks if the given email already exists on one of the users
	 * @param email Email address to check
	 * @returns Boolean if the email exists
	 */
	async emailExists(email: string): Promise<boolean> {
		const foundUser = await this.repository.findOne({ email });

		return foundUser !== undefined;
	}

	/**
	 * Checks if the given phone number already exists on one of the users
	 * @param phone Phone number to check
	 * @returns Boolean if the phone number exists
	 */
	async phoneExists(phone: string): Promise<boolean> {
		const foundUser = await this.repository.findOne({ phone });

		return foundUser !== undefined;
	}

	/**
	 * Should return the user with the corresponding email
	 * @param email Email for which the user should be found for
	 * @returns Found user or null
	 */
	getByEmail(email: string): Promise<User> {
		return this.repository.findOne({
			where: { email },
		});
	}

	/**
	 * Returns the user with the provided id, including its roles
	 * @param id Id of the requested user
	 * @returns Found user or null
	 */
	getByIdWithRoles(id: string): Promise<User> {
		return this.repository.findOne({
			relations: ['roles'],
			where: { id },
		});
	}

	/**
	 * Returns the user with the provided username, including its roles
	 * @param username Username of the requested user
	 * @returns Found user or null
	 */
	getByUsernameWithRoles(username: string): Promise<User> {
		return this.repository.findOne({
			relations: ['roles'],
			where: { username },
		});
	}

	/**
	 * Returns the user with the corresponding email
	 * @param email Email for which the user should be found for
	 * @returns Found user or null
	 */
	getByEmailWithRoles(email: string): Promise<User> {
		return this.repository.findOne({
			relations: ['roles'],
			where: { email },
		});
	}
}
