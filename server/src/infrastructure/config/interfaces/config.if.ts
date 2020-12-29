import {
	IAppConfig,
	IHostEnvironment,
	IServerConfig,
	IChallengeConfig,
	IJwtConfig,
} from '.';

/**
 * Interface for the global configuration options
 */
export interface IConfig {
	env: IHostEnvironment;
	app: IAppConfig;
	jwt: IJwtConfig;
	challenge: IChallengeConfig;
	server: IServerConfig;
}
