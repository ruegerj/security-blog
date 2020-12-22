import { Tokens } from '@infrastructure/ioc';
import Container from 'typedi';
import { createConnection, useContainer } from 'typeorm';
import { UnitOfWorkFactory } from './uow/factory';

/**
 * Configures the data access specific services & dependencies
 */
export async function configure(): Promise<void> {
	const logger = Container.get(Tokens.ILogger);

	useContainer(Container); // Hook up container with typeorm

	const connection = await createConnection();

	logger.info('Connected to database', connection.options.database);

	Container.import([UnitOfWorkFactory]);
}
