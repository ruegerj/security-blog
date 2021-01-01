import { IEntity } from '@data-access/entities/interfaces';
import { IRepository } from '@data-access/repositories/interfaces';
import { Repository } from 'typeorm';

/**
 * Base class for all typeorm specific repository implementations
 */
export abstract class RepositoryBase<TEntity extends IEntity>
	implements IRepository<TEntity> {
	constructor(protected readonly repository: Repository<TEntity>) {}

	getAll(): Promise<TEntity[]> {
		return this.repository.find();
	}

	getById(id: string): Promise<TEntity> {
		return this.repository.findOne(id);
	}

	async add(item: TEntity): Promise<TEntity> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = await this.repository.insert({ ...(item as any) });

		item.id = result.identifiers[0].id; // Only one entity added => take first id

		return item;
	}

	async update(item: TEntity): Promise<TEntity> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await this.repository.update(item.id, {
			...(item as any),
		});

		return item;
	}

	async remove(item: TEntity): Promise<void> {
		await this.repository.delete(item.id);
	}
}
