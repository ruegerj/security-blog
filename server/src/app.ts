import { Server } from 'http';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { ControllerBase } from './controllers/';
import { Config } from './infrastructure/config';

export class App {
	private readonly app: express.Application;

	constructor(
		controllers: ControllerBase[],
		private readonly _config: Config
	) {
		this.app = express();

		this.initializeMiddleware();
		this.initializeControllers(controllers);
	}

	/**
	 * Intializes and starts a http server
	 * @returns Http server instance
	 */
	public listen(): Server {
		return this.app.listen(
			this._config.server.port,
			this._config.server.hostname,
			() => {
				console.log(
					`Security blog server is listening on http://${this._config.server.hostname}:${this._config.server.port}`
				);
			}
		);
	}

	/**
	 * Adds the middlware components to the express stack
	 */
	private initializeMiddleware() {
		// TODO: configure
		// Set security http headers
		this.app.use(helmet());

		// Add request logger for development
		if (this._config.env.isDevelopment) {
			this.app.use(morgan('dev'));
		}

		// Limit allowed body size
		this.app.use(
			express.json({
				limit: this._config.app.bodySizeLimit,
			})
		);
	}

	/**
	 * Registers the routers of the provided controllers in the express stack
	 * @param controllers Controllers which should be registered
	 */
	private initializeControllers(controllers: ControllerBase[]) {
		for (const controller of controllers) {
			this.app.use(controller.basePath, controller.router);
		}
	}
}
