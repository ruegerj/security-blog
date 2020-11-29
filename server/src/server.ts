import Container from 'typedi';
import { App } from './app';
import { NodeConfigResolver } from './infrastructure/config';
import { Tokens } from './infrastructure/ioc';
import { WinstonLogger } from './infrastructure/logger/winstonLogger';

// Global handler for uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	process.exit(1);
});

// Register config in ioc
const configResolver = new NodeConfigResolver();
const config = configResolver.resolve(process.env);

Container.set({
	id: Tokens.IConfig,
	value: config,
});

// Import depedencies of "App" in order to ensure that they're getting registered
Container.import([WinstonLogger]);

// Setup & start app
const app = Container.get(App);
const server = app.listen();

// Global handler for promise rejections
process.on('unhandledRejection', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	// Shut down server before exiting process
	server.close(() => process.exit(1));
});
