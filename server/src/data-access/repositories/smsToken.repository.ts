import { SmsToken, User } from '@data-access/entities';
import { ISmsTokenRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `ISmsTokenRepository`
 */
export class SmsTokenRepository
	extends RepositoryBase<SmsToken>
	implements ISmsTokenRepository {
	/**
	 * Returns the lastest token that was issued to the provided user
	 * @param user User whose latest token is reqeuested
	 * @returns Latest token or null if no token exists
	 */
	async getLastestForUser(user: User): Promise<SmsToken> {
		const tokens = await this.repository.find({
			order: {
				issuedAt: 'DESC',
			},
			where: {
				user,
			},
		});

		return tokens[0];
	}
}
