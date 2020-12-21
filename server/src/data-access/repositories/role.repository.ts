import { Role } from '@data-access/entities';
import { IRoleRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `IRoleRepository`
 */
export class RoleRepository
	extends RepositoryBase<Role>
	implements IRoleRepository {}
