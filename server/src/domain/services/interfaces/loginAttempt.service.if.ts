import { LoginAttemptType } from '@domain/dtos/enums';

/**
 * Interface for a service which handles login attempt related operations
 */
export interface ILoginAttemptService {
	/**
	 * Should create a new login attempt corresponding to the given parameters
	 * @param type Type of the attempt which should be created
	 * @param successful Boolean indicating if the attempt was successful
	 * @param userIdentity Email or username with which the attempt was issued
	 */
	createAttempt(
		type: LoginAttemptType,
		successful: boolean,
		userIdentity?: string,
	): Promise<void>;

	/**
	 * Should check if the max amount of failed login attempts have been exceeded by the given user
	 * @param userIdentity Email or username of the user for which it should be checked
	 * @param type Optional type of attempts which should be taken in consideration, default is all types
	 * @returns Boolean if the max attempts have been exceeded
	 */
	loginAttemptsExceeded(
		userIdentity: string,
		type?: LoginAttemptType,
	): Promise<boolean>;
}
