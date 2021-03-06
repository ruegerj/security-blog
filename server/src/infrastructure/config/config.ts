import {
	IAppConfig,
	IAuthConfig,
	IChallengeConfig,
	IConfig,
	IJwtConfig,
	IServerConfig,
} from './interfaces';
import { HostEnvironment } from './hostEnvironment';

export class Config implements IConfig {
	env: HostEnvironment;
	app: IAppConfig;
	jwt: IJwtConfig;
	auth: IAuthConfig;
	challenge: IChallengeConfig;
	server: IServerConfig;
}
