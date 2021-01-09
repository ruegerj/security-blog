import { AttemptType, LoginAttempt, User } from '@data-access/entities';
import { MoreThan } from 'typeorm';
import { ILoginAttemptRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `ILoginAttemptRepository`
 */
export class LoginAttemptRepository
	extends RepositoryBase<LoginAttempt>
	implements ILoginAttemptRepository {
	/**
	 * Returns all failed login attempts from the provided user since the provided timestamp
	 * @param user User for whose attempts are requested
	 * @param timestamp Timestamp from which on all attempts should be returned in the future
	 * @param type Optional type of attempts which should be taken in consideration, default is all types
	 */
	getAllFailedFromUserSince(
		user: User,
		timestamp: Date,
		type?: AttemptType,
	): Promise<LoginAttempt[]> {
		return this.repository.find({
			where: {
				successful: false,
				timestamp: MoreThan(timestamp),
				user: user,
				type: type,
			},
		});
	}
}
