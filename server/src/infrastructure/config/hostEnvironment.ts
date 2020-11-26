import { IHostEnvironment } from './interfaces';

/**
 * Specific implementation for IHostingEvironment
 */
export class HostEnvironment implements IHostEnvironment {
	constructor(public name: string) {}

	get isDevelopment(): boolean {
		return this.name === 'development';
	}

	get isTesting(): boolean {
		return this.name === 'testing';
	}

	get isProduction(): boolean {
		return this.name === 'production';
	}
}
