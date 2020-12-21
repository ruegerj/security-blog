import { User } from '@data-access/entities';
import { IUserRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `IUserRepository`
 */
export class UserRepository
	extends RepositoryBase<User>
	implements IUserRepository {}
