import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { IUnitOfWork } from '../interfaces';
import { UnitOfWork } from '../uow';
import { IUnitOfWorkFactory } from './interfaces';

/**
 * TypeORM specific implementation of `IUnitOfWorkFactory`
 */
@Service({ id: Tokens.IUnitOfWorkFactory })
export class UnitOfWorkFactory implements IUnitOfWorkFactory {
	constructor(
		@InjectConnection()
		private connection: Connection,
		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {}

	/**
	 * Creates a new TypeOrm specific Unit of Work
	 * @param transactional Specifies if the created unit of work instance should run its operations within a transaction
	 */
	create(transactional: boolean): IUnitOfWork {
		return new UnitOfWork(this.connection, transactional, this.logger);
	}
}
