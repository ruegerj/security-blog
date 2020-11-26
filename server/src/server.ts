import { App } from './app';
import { TypeMap, container } from './infrastructure/ioc';

// Global handler for uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	process.exit(1);
});

// Setup & start app
const app = container.get<App>(TypeMap.App);
const server = app.listen();

// Global handler for promise rejections
process.on('unhandledRejection', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	// Shut down server before exiting process
	server.close(() => process.exit(1));
});
