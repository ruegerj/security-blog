import { IRepository } from '@data-access/repositories/interfaces';
import { LoginAttempt } from '../../entities/loginAttempt';

/**
 * Interface for all repository implementations for the `LoginAttempt` entity
 */
export type ILoginAttemptRepository = IRepository<LoginAttempt>;
