import { Server } from 'http';
import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import { ControllerBase } from './controllers/';
import { IConfig } from './infrastructure/config/interfaces';
import { FailResponse } from './infrastructure/responses';
import { Inject, InjectMany, Service } from 'typedi';
import { Tokens } from './infrastructure/ioc';
import { ILogger } from './infrastructure/logger/interfaces';

@Service()
export class App {
	private readonly app: express.Application;

	constructor(
		@InjectMany(Tokens.ControllerBase)
		controllers: ControllerBase[],
		@Inject(Tokens.IConfig)
		private readonly config: IConfig,
		@Inject(Tokens.ILogger)
		private readonly logger: ILogger,
	) {
		this.config = config;

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
			this.config.server.port,
			this.config.server.hostname,
			() => {
				this.logger.info(
					`Security blog server is listening on http://${this.config.server.hostname}:${this.config.server.port}`,
				);
			},
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
		const morganFormat = this.config.env.isDevelopment ? 'dev' : 'combined';
		this.app.use(morgan(morganFormat, { stream: this.logger.stream() }));

		// Apply rate limiting for api endpoints
		const rateLimitFail = new FailResponse(
			`There were too many request from your IP, please try again in ${
				this.config.app.requestLimitWindow / 1000 / 60
			} minutes`,
		);

		const limiter = rateLimit({
			max: this.config.app.requestLimitCount,
			windowMs: this.config.app.requestLimitWindow,
			message: JSON.stringify(rateLimitFail),
		});

		this.app.use('/api', limiter);

		// Limit allowed body size
		this.app.use(
			express.json({
				limit: this.config.app.bodySizeLimit,
			}),
		);

		// Limit url encoded body size
		this.app.use(
			express.urlencoded({
				extended: true,
				limit: this.config.app.bodySizeLimit,
			}),
		);

		// Request sanitization against XSS
		this.app.use(xss());

		// Prevent HTTP parameter pollution
		this.app.use(hpp());
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
