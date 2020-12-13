import { Repository } from 'typeorm';
import { IRepository } from './interfaces/repository.if';

/**
 * Base class for all typeorm specific repository implementations
 */
export abstract class RepositoryBase<TEntity> implements IRepository<TEntity> {
	constructor(private readonly repository: Repository<TEntity>) {}

	getAll(): Promise<TEntity[]> {
		return this.repository.find();
	}

	getById(id: string): Promise<TEntity> {
		return this.repository.findOne(id);
	}

	async add(item: TEntity): Promise<void> {
		await this.repository.save(item);
	}

	async update(item: TEntity): Promise<void> {
		await this.repository.save(item);
	}

	remove(item: TEntity): Promise<void> {
		const res = this.repository.delete(item.id);
	}
}
