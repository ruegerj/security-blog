import { IAppConfig, IHostEnvironment, IServerConfig } from '.';
import { IJwtConfig } from './jwt.config.if';

/**
 * Interface for the global configuration options
 */
export interface IConfig {
	env: IHostEnvironment;
	app: IAppConfig;
	jwt: IJwtConfig;
	server: IServerConfig;
}
