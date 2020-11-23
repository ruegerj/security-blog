import { Config } from '../config';

/**
 * Interface for a component which should resolve a @see Config obj based on a environment
 */
export interface IConfigResolver<TEnvironment> {
	/**
	 * Should resolve a @see Config object from the provided environment
	 * @param environment Environment which contains the nescessary variables
	 */
	resolve(environment: TEnvironment): Config;
}
