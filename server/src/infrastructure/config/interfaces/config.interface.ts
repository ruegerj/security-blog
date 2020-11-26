import { IAppConfig, IHostEnvironment, IServerConfig } from '.';

/**
 * Interface for the global configuration options
 */
export interface IConfig {
	env: IHostEnvironment;
	app: IAppConfig;
	server: IServerConfig;
}
