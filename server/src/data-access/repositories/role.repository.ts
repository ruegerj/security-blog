import { Role } from '@data-access/entities';
import { IRoleRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `IRoleRepository`
 */
export class RoleRepository
	extends RepositoryBase<Role>
	implements IRoleRepository {
	/**
	 * Returns the role with the provided name
	 * @param name Name of the requested role
	 * @returns First found role or null
	 */
	getByName(name: string): Promise<Role> {
		return this.repository.findOne({
			where: {
				name,
			},
		});
	}
}
