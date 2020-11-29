import { ILogStreamObject } from './logStreamObject.interface';

/**
 * Interface for any logger implementation of the app
 */
export interface ILogger {
	/**
	 * Should log the given message and meta data with the level "trace/verbose"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	trace(message: string, ...meta: unknown[]): void;

	/**
	 * Should log the given message and meta data with the level "debug"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	debug(message: string, ...meta: unknown[]): void;

	/**
	 * Should log the given message and meta data with the level "info"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	info(message: string, ...meta: unknown[]): void;

	/**
	 * Should log the given message and meta data with the level "warn"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	warn(message: string, ...meta: unknown[]): void;

	/**
	 * Should log the given message and meta data with the level "error"
	 * @param message Message which should be logged
	 * @param meta Any meta data which should be stored additionaly
	 */
	error(message: string, ...meta: unknown[]): void;

	/**
	 * Should provide a log stream obj for writing in the log stream
	 */
	stream(): ILogStreamObject;
}
