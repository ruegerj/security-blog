import { ICredentials } from '@domain/dtos/interfaces';

/**
 * Interface for a service which handles all challenge related operations
 */
export interface IChallengeService {
	/**
	 * Should create a SMS challenge for the given user
	 * @param credentials Credentials of the user who requests the challenge
	 */
	requestSmsChallenge(credentials: ICredentials): Promise<void>;
}
