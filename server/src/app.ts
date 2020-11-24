import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { ControllerBase } from './controllers/';
import { Config } from './infrastructure/config';

export class App {
	app: express.Application;

	constructor(controllers: ControllerBase[], private config: Config) {
		this.app = express();

		this.initializeMiddleware();
		this.initializeControllers(controllers);
	}

	/**
	 * Adds the middlware components to the express stack
	 */
	initializeMiddleware() {
		// TODO: configure
		// Set security http headers
		this.app.use(helmet());

		if (this.config.env.isDevelopment) {
			this.app.use(morgan('dev'));
		}

		// TODO: store in config
		// Json body parser
		this.app.use(express.json({
            limit: "10kb",
        }));
	}

	/**
	 * Registers the routers of the provided controllers in the express stack
	 * @param controllers Controllers which should be registered
	 */
	initializeControllers(controllers: ControllerBase[]) {
		for (const controller of controllers) {
			this.app.use(controller.basePath, controller.router);
		}
	}
}
