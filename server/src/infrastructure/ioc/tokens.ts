import { ControllerBase } from '../../controllers';
import { Token } from 'typedi';
import { IConfig } from '../config/interfaces';
import { ILogger } from '../logger/interfaces';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import {
	IAuthenticationService,
	IHashingService,
} from '@domain/services/interfaces';

/**
 * Global token collection which are used as service identifiers for typedi
 */
export const Tokens = {
	// Api
	IConfig: new Token<IConfig>(),
	ILogger: new Token<ILogger>(),
	ControllerBase: new Token<ControllerBase>(),
	// Domain
	IAuthenticationService: new Token<IAuthenticationService>(),
	IHashingService: new Token<IHashingService>(),
	// Data access
	IUnitOfWorkFactory: new Token<IUnitOfWorkFactory>(),
};
