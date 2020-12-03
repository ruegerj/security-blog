import path from 'path';
import { Inject, Service } from 'typedi';
import { createLogger, format, Logger, transports } from 'winston';
import { IConfig } from '../config/interfaces';
import { Tokens } from '../ioc';
import { ILogger, ILogStreamObject } from './interfaces';

@Service({ id: Tokens.ILogger, global: true })
/**
 * ILogger implementation for winston
 */
export class WinstonLogger implements ILogger {
	private readonly logger: Logger;

	constructor(@Inject(Tokens.IConfig) private readonly config: IConfig) {
		this.logger = this.initialize();
	}

	/**
	 * Logs the given message and meta data with the level "trace/verbose"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	trace(message: string, ...meta: unknown[]): void {
		this.logger.verbose(message, meta);
	}

	/**
	 * Logs the given message and meta data with the level "trace/verbose"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	debug(message: string, ...meta: unknown[]): void {
		this.logger.debug(message, meta);
	}

	/**
	 * Logs the given message and meta data with the level "info"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	info(message: string, ...meta: unknown[]): void {
		this.logger.info(message, meta);
	}

	/**
	 * Logs the given message and meta data with the level "warn"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	warn(message: string, ...meta: unknown[]): void {
		this.logger.warn(message, meta);
	}

	/**
	 * Logs the given message and meta data with the level "error"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	error(message: string, ...meta: unknown[]): void {
		this.logger.error(message, meta);
	}

	/**
	 * Provides a log stream obj which is able to write info logs
	 */
	stream(): ILogStreamObject {
		return {
			write: (message: string) => {
				this.logger.info(message);
			},
		};
	}

	/**
	 * Creates and configures a new winston logger instance
	 */
	private initialize(): Logger {
		// Determine minimal log level according to env
		const minimalLevel = this.config.env.isDevelopment ? 'debug' : 'info';

		const logFormat = format.printf(
			(info) =>
				`${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
		);

		const logfileLocation = path.join(this.config.app.dataLocation, 'logs');

		return createLogger({
			level: minimalLevel,
			format: format.combine(
				format.label({ label: path.basename(require.main.filename) }), // log origin
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				format.metadata({
					fillExcept: ['message', 'level', 'timestamp', 'label'],
				}),
			),
			transports: [
				new transports.Console({
					format: format.combine(
						format.colorize(),
						format.cli(),
						logFormat,
					),
				}),
				new transports.File({
					filename: path.join(logfileLocation, 'all.log'),
					format: format.combine(
						format.errors({ stack: true }),
						format.json(),
					),
				}),
			],
			exitOnError: false,
		});
	}
}
