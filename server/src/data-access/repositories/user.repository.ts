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
	 * Returns the user with the corresponding email
	 * @param email Email for which the user should be found for
	 * @returns Found user or null
	 */
	getByEmail(email: string): Promise<User> {
		return this.repository.findOne({
			relations: ['role'],
			where: { email },
		});
	}
}
