import { SmsToken } from '@data-access/entities';
import { ISmsTokenRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `ISmsTokenRepository`
 */
export class SmsTokenRepository
	extends RepositoryBase<SmsToken>
	implements ISmsTokenRepository {}
