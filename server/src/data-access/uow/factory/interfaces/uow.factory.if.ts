import { IUnitOfWork } from '@data-access/uow/interfaces';

/**
 * Interface for any unit of work factory implementations
 */
export interface IUnitOfWorkFactory {
	/**
	 * Should create and return a new `IUnitOfWork` instance
	 * @returns Created UoW instance
	 */
	create(): IUnitOfWork;
}
