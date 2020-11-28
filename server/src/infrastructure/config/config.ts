import { IAppConfig, IConfig, IServerConfig } from './interfaces';
import { HostEnvironment } from './hostEnvironment';

export class Config implements IConfig {
	env: HostEnvironment;
	app: IAppConfig;
	server: IServerConfig;
}
