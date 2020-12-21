import { IRepository } from '@data-access/repositories/interfaces';
import { Role } from '../../entities/role';

/**
 * Interface for all repository implementations for the `Role` entity
 */
export type IRoleRepository = IRepository<Role>;
