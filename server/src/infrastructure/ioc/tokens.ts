import { ControllerBase } from '../../controllers';
import { Token } from 'typedi';
import { IConfig } from '../config/interfaces';
import { ILogger } from '../logger/interfaces';

/**
 * Global token collection which are used as service identifiers for typedi
 */
export const Tokens = {
	IConfig: new Token<IConfig>(),
	ILogger: new Token<ILogger>(),
	ControllerBase: new Token<ControllerBase>(),
};
