import { IRepository } from '@data-access/repositories/interfaces';
import { Role } from '../../entities/role';

/**
 * Interface for all repository implementations for the `Role` entity
 */
export interface IRoleRepository extends IRepository<Role> {
	/**
	 * Should return the role with the provided name
	 * @param name Name of the requested role
	 * @returns First found role or null
	 */
	getByName(name: string): Promise<Role>;
}
