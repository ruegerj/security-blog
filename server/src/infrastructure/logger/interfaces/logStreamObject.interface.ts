/**
 * Interface for an object which should be able to write into a log stream
 */
export interface ILogStreamObject {
	/**
	 * Should write the provided message in the underlying stream
	 * @param message Message to write
	 * @param encoding Optional encoding of the message
	 */
	write(message: string, encoding?: string): void;
}
