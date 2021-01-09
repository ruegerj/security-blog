import { User } from '@data-access/entities';
import { IRepository } from '@data-access/repositories/interfaces';
import { AttemptType, LoginAttempt } from '../../entities/loginAttempt';

/**
 * Interface for all repository implementations for the `LoginAttempt` entity
 */
export interface ILoginAttemptRepository extends IRepository<LoginAttempt> {
	/**
	 * Should return all failed login attempts from the provided user since the provided timestamp
	 * @param user User for whose attempts are requested
	 * @param timestamp Timestamp from which on all attempts should be returned in the future
	 * @param type Optional type of attempts which should be taken in consideration, default is all types
	 */
	getAllFailedFromUserSince(
		user: User,
		timestamp: Date,
		type?: AttemptType,
	): Promise<LoginAttempt[]>;
}
