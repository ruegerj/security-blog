import { IEntity } from '@data-access/entities/interfaces';

/**
 * Interface for a generic repository
 */
export interface IRepository<TEntity extends IEntity> {
	/**
	 * Implementation should return all items of this entity
	 */
	getAll(): Promise<TEntity[]>;

	/**
	 * Implementation should return the item with the specified id
	 * @param id Id of the requested id
	 * @returns Found item or null
	 */
	getById(id: string): Promise<TEntity>;

	/**
	 * Implementation should add the provided item to the collection
	 * @param item Item which should be added
	 */
	add(item: TEntity): Promise<TEntity>;

	/**
	 * Implementation should update the provided item
	 * @param item Item which should be updated
	 */
	update(item: TEntity): Promise<TEntity>;

	/**
	 * Implementation should remove the provided item
	 * @param item Item which should be removed
	 */
	remove(item: TEntity): Promise<void>;
}
