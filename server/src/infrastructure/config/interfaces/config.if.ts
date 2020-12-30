import {
	IAppConfig,
	IHostEnvironment,
	IServerConfig,
	IChallengeConfig,
	IJwtConfig,
	IAuthConfig,
} from '.';

/**
 * Interface for the global configuration options
 */
export interface IConfig {
	env: IHostEnvironment;
	app: IAppConfig;
	jwt: IJwtConfig;
	auth: IAuthConfig;
	challenge: IChallengeConfig;
	server: IServerConfig;
}
