import { Server } from 'http';
import path from 'path';
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xss = require('xss-clean'); // use "require" because the lack of type definitions
import hpp from 'hpp';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import Container from 'typedi';
import { errorHandler, limit, loadHandler } from '@infrastructure/middleware';
import { IConfig } from '@infrastructure/config/interfaces';
import { IConfigResolver } from '@infrastructure/config';
import { Tokens } from '@infrastructure/ioc';
import { WinstonLogger } from '@infrastructure/logger/winstonLogger';
import * as dataAccess from '@data-access/configure';
import * as domain from '@domain/configure';
import { ILogger } from '@infrastructure/logger/interfaces';
import { AuthenticationController, ChallengeController } from './controllers';

export class App {
	private readonly app: express.Application;
	private config: IConfig;
	private logger: ILogger;
	private configured: boolean;

	constructor(private resolver: IConfigResolver<NodeJS.ProcessEnv>) {
		this.app = express();
	}

	/**
	 * Intializes and starts a http server
	 * @returns Http server instance
	 */
	listen(): Server {
		return this.app.listen(
			this.config.server.port,
			this.config.server.hostname,
			() => {
				const stage = this.config.env.isDevelopment
					? 'DEV'
					: this.config.env.isTesting
					? 'TEST'
					: this.config.env.isProduction
					? 'PROD'
					: this.config.env.name;

				this.logger.info(
					`[${stage}] Security blog server is listening on http://${this.config.server.hostname}:${this.config.server.port}`,
				);
			},
		);
	}

	/**
	 * Configures the application and its components
	 */
	async configure(): Promise<void> {
		if (this.configured) {
			throw new Error('Application has already been configured');
		}

		await this.configureServices();

		this.addMiddleware();
		this.registerControllers();
		this.serveStaticFiles();
		this.registerErrorHandler();

		this.configured = true;
	}

	/**
	 * Sets up the IoC container and registers all used services
	 */
	private async configureServices(): Promise<void> {
		// Resolve and register config
		this.config = this.resolver.resolve(process.env);

		Container.set({
			id: Tokens.IConfig,
			value: this.config,
		});

		// Resolve and register logger instance
		Container.import([WinstonLogger]);

		this.logger = Container.get(Tokens.ILogger);

		// Register all data dependencies & services from the data access
		await dataAccess.configure();

		// Register all data dependencies & services from the domain
		await domain.configure();

		// Register all controller used by the application
		Container.import([AuthenticationController, ChallengeController]);
	}

	/**
	 * Adds the middlware components to the express stack
	 */
	private addMiddleware() {
		// Add request logger
		const morganFormat = this.config.env.isDevelopment ? 'dev' : 'combined';
		this.app.use(morgan(morganFormat, { stream: this.logger.stream() }));

		// Apply rate limiting for api endpoints
		this.app.use(
			'/api',
			limit(
				this.config.app.requestLimitWindow,
				this.config.app.requestLimitCount,
			),
		);

		// Add event loop monitoring and load handling
		this.app.use(loadHandler(this.config, this.logger));

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

		// Add middleware for parsing request cookies
		this.app.use(cookieParser());

		// Set security http headers
		// For config see: https://helmetjs.github.io/
		this.app.use(helmet());

		// Set and configure content security policy
		this.app.use(
			helmet.contentSecurityPolicy({
				directives: {
					defaultSrc: ["'self'"], // Default value for all directives that are absent
					scriptSrc: ["'self'"], // Scripts shall only be loaded from own domain
					frameAncestors: ["'none'"], // Deny frame representations on any domain
					imgSrc: ["'self'"], // Img's shall only be loaded from own domain
					styleSrc: ["'self'"], // Styles shall only be loaded from own domain
				},
			}),
		);

		// Request sanitization against XSS
		this.app.use(xss());

		// Prevent HTTP parameter pollution
		this.app.use(hpp());
	}

	/**
	 * Registers the routers of the provided controllers in the express stack, Must be called after `connfigureServices()`
	 */
	private registerControllers() {
		const controllers = Container.getMany(Tokens.ControllerBase);

		for (const controller of controllers) {
			controller.initializeRoutes();
			this.app.use(controller.basePath, controller.router);
		}
	}

	/**
	 * Configures the application to serve the static files from the hosted SPA client (angular)
	 */
	private serveStaticFiles() {
		// Use compression middlware reduce size of static files
		this.app.use(compression());

		// Determine max age uppon current stage
		const maxAge = this.config.env.isDevelopment
			? undefined
			: this.config.app.staticContentMaxAge;

		const staticContentLocation = path.join(__dirname, '../client');

		// Configure middleware for serving static file
		this.app.get(
			'*.(js|css|ttf|svg|png|jpg|jpeg|ico|woff2|woff|txt|html)',
			express.static(staticContentLocation, {
				maxAge,
			}),
		);

		// Configure middleware for serving the angular applicaiton paths
		this.app.all('*', (req: Request, res: Response) => {
			res.status(200).sendFile('/', {
				root: staticContentLocation,
			});
		});
	}

	/**
	 * Register the custom error handling middleware to the express stack
	 */
	private registerErrorHandler() {
		this.app.use(errorHandler(this.config, this.logger));
	}
}
