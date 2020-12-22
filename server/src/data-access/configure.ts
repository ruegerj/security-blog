import Container from 'typedi';
import { UnitOfWorkFactory } from './uow/factory';

/**
 * Configures the data access specific services & dependencies
 */
export function configure(): void {
	Container.import([UnitOfWorkFactory]);
}
