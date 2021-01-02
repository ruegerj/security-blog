import { User } from '@data-access/entities';
import { IRepository } from '@data-access/repositories/interfaces';
import { SmsToken } from '../../entities/smsToken';

/**
 * Interface for all repository implementations for the `SmsToken` entity
 */
export interface ISmsTokenRepository extends IRepository<SmsToken> {
	/**
	 * Should return the lastest token that was issued to the provided user
	 * @param user User whose latest token is reqeuested
	 * @returns Latest token or null if no token exists
	 */
	getLastestForUser(user: User): Promise<SmsToken>;
}
