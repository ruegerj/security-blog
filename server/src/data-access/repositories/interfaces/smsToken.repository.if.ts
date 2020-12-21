import { IRepository } from '@data-access/repositories/interfaces';
import { SmsToken } from '../../entities/smsToken';

/**
 * Interface for all repository implementations for the `SmsToken` entity
 */
export type ISmsTokenRepository = IRepository<SmsToken>;
