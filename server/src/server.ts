import { Server } from 'http';
import { NodeConfigResolver } from '@infrastructure/config';
import { App } from './app';

// Global handler for uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	process.exit(1);
});

const configResolver = new NodeConfigResolver();

let server: Server;

// Create and bootstrap application
const app = new App(configResolver);

app.configure().then(() => {
	// Start server
	server = app.listen();
});

// Global handler for promise rejections
process.on('unhandledRejection', (err) => {
	console.error('[Fatal error]', err);
	console.error('Shutting down app...');

	// Shut down server before exiting process
	server?.close(() => process.exit(1));
});
