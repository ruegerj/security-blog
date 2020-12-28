/**
 * Interface for a service which handles login attempt related operations
 */
export interface ILoginAttemptService {
	/**
	 * Should create a new login attempt corresponding to the given parameters
	 * @param successful Boolean indicating if the attempt was successful
	 * @param email Email with which the attempt was issued
	 */
	createAttempt(successful: boolean, email?: string): Promise<void>;
}
