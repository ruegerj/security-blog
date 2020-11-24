import { cleanEnv, num, str } from 'envalid';
import { Config, HostEnvironment } from '../config';
import { IConfigResolver } from './configResolver.interface';

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
	validate(environment: NodeJS.ProcessEnv) {
		cleanEnv(environment, {
			NODE_ENV: str(),
			// App
			APP_BODY_SIZE_LIMIT: str(),
			// Server
			SERVER_PORT: num(),
			SERVER_HOST: str(),
		});
	}
}
