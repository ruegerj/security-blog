import { bool, cleanEnv, num, str } from 'envalid';
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
				logfileSize: parseInt(environment.APP_LOG_SIZE, 10),
				maxLag: parseInt(environment.APP_MAX_LAG, 10),
				dataLocation: environment.APP_DATA_DIR,
			},
			jwt: {
				accessToken: {
					key: environment.JWT_ACCESS_TOKEN_KEY,
					expiresIn: environment.JWT_ACCESS_TOKEN_EXPIRES_IN,
				},
				refreshToken: {
					key: environment.JWT_REFRESH_TOKEN_KEY,
					expiresIn: environment.JWT_REFRESH_TOKEN_EXPIRES_IN,
				},
				challengeToken: {
					key: environment.JWT_CHALLENGE_TOKEN_KEY,
					expiresIn: environment.JWT_CHALLENGE_TOKEN_EXPIRES_IN,
				},
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
			APP_LOG_SIZE: num(),
			APP_MAX_LAG: num(),
			APP_DATA_DIR: str(),
			// JWT
			JWT_ACCESS_TOKEN_KEY: str(),
			JWT_ACCESS_TOKEN_EXPIRES_IN: str(),
			JWT_REFRESH_TOKEN_KEY: str(),
			JWT_REFRESH_TOKEN_EXPIRES_IN: str(),
			JWT_CHALLENGE_TOKEN_KEY: str(),
			JWT_CHALLENGE_TOKEN_EXPIRES_IN: str(),
			// Server
			SERVER_PORT: num(),
			SERVER_HOST: str(),
			// TypeORM
			TYPEORM_CONNECTION: str(),
			TYPEORM_DATABASE: str(),
			TYPEORM_LOGGING: bool(),
			TYPEORM_SYNCHRONIZE: bool(),
			TYPEORM_ENTITIES: str(),
			TYPEORM_ENTITIES_DIR: str(),
			TYPEORM_MIGRATIONS: str(),
			TYPEORM_MIGRATIONS_DIR: str(),
			TYPEORM_MIGRATIONS_TABLE_NAME: str(),
		});
	}
}
