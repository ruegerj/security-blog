import { ControllerBase } from '../../controllers';
import { Token } from 'typedi';
import { IConfig } from '../config/interfaces';

/**
 * Global token collection which are used as service identifiers for typedi
 */
export const Tokens = {
	IConfig: new Token<IConfig>(),
	ControllerBase: new Token<ControllerBase>(),
};
