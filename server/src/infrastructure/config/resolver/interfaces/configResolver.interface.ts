import { IConfig } from '../../interfaces';

/**
 * Interface for a component which should resolve a IConfig obj based on a environment
 */
export interface IConfigResolver<TEnvironment> {
	/**
	 * Should resolve a Config object from the provided environment
	 * @param environment Environment which contains the nescessary variables
	 */
	resolve(environment: TEnvironment): IConfig;
}
