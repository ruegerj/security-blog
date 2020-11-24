export class Config {
	env: HostEnvironment;
	app: AppConfig;
	server: ServerConfig;
}

export class HostEnvironment {
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

export class AppConfig {
	bodySizeLimit: string;
}

export class ServerConfig {
	hostname: string;
	port: number;
}
