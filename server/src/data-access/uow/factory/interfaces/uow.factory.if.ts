import { IUnitOfWork } from '@data-access/uow/interfaces';

/**
 * Interface for any unit of work factory implementations
 */
export interface IUnitOfWorkFactory {
	/**
	 * Should create and return a new `IUnitOfWork` instance
	 * @param transactional Specifies if the created unit of work instance should run its operations within a transaction
	 * @returns Created UoW instance
	 */
	create(transactional: boolean): IUnitOfWork;
}
