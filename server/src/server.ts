import { App } from './app';
import { ControllerBase } from './controllers';
import { NodeConfigResolver } from './infrastructure/config';

// Global handler for uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	process.exit(1);
});

// Resolve config from environment
const configResolver = new NodeConfigResolver();
const config = configResolver.resolve(process.env);

// Register controllers
const controllers: ControllerBase[] = [];

// Setup & start app
const app = new App(controllers, config);
const server = app.listen();

// Global handler for promise rejections
process.on('unhandledRejection', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	// Shut down server before exiting process
	server.close(() => process.exit(1));
});
