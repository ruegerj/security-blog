import { injectable } from 'inversify';
import { IAppConfig, IConfig, IServerConfig } from './interfaces';
import { HostEnvironment } from './hostEnvironment';

@injectable()
export class Config implements IConfig {
	env: HostEnvironment;
	app: IAppConfig;
	server: IServerConfig;
}
