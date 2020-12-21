import { IRepository } from '@data-access/repositories/interfaces';
import { User } from '../../entities/user';

/**
 * Interface for all repository implementations for the `User` entity
 */
export type IUserRepository = IRepository<User>;
