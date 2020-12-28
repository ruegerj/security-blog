import { IAppConfig, IConfig, IJwtConfig, IServerConfig } from './interfaces';
import { HostEnvironment } from './hostEnvironment';

export class Config implements IConfig {
	env: HostEnvironment;
	app: IAppConfig;
	jwt: IJwtConfig;
	server: IServerConfig;
}
