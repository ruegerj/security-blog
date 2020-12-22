import { ControllerBase } from '../../controllers';
import { Token } from 'typedi';
import { IConfig } from '../config/interfaces';
import { ILogger } from '../logger/interfaces';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';

/**
 * Global token collection which are used as service identifiers for typedi
 */
export const Tokens = {
	IConfig: new Token<IConfig>(),
	ILogger: new Token<ILogger>(),
	IUnitOfWorkFactory: new Token<IUnitOfWorkFactory>(),
	ControllerBase: new Token<ControllerBase>(),
};
