import { cleanEnv, num, str } from 'envalid';
import { Config } from '../config';
import { HostEnvironment } from '../hostEnvironment';
import { IConfigResolver } from './interfaces/configResolver.interface';

/**
 * Node specific implmentation of @see {IConfigResolver}
 */
export class NodeConfigResolver implements IConfigResolver<NodeJS.ProcessEnv> {
	resolve(environment: NodeJS.ProcessEnv): Config {
		this.validate(environment);

		return {
			env: new HostEnvironment(environment.NODE_ENV),
			app: {
				bodySizeLimit: environment.APP_BODY_SIZE_LIMIT,
				requestLimitCount: parseInt(environment.APP_REQUEST_LIMIT, 10),
				requestLimitWindow: parseInt(
					environment.APP_REQUEST_LIMIT_WINDOW,
					10,
				),
			},
			server: {
				port: parseInt(environment.SERVER_PORT, 10),
				hostname: environment.SERVER_HOST,
			},
		};
	}

	/**
	 * Validates if all required env variables are present and have the correct type
	 * @returns void or fails if env var isn't present or has incorrect type
	 */
	validate(environment: NodeJS.ProcessEnv): void {
		cleanEnv(environment, {
			NODE_ENV: str(),
			// App
			APP_BODY_SIZE_LIMIT: str(),
			APP_REQUEST_LIMIT: num(),
			APP_REQUEST_LIMIT_WINDOW: num(),
			// Server
			SERVER_PORT: num(),
			SERVER_HOST: str(),
		});
	}
}
