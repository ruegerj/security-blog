import { LoginAttempt } from '@data-access/entities';
import { ILoginAttemptRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `ILoginAttemptRepository`
 */
export class LoginAttemptRepository
	extends RepositoryBase<LoginAttempt>
	implements ILoginAttemptRepository {}
