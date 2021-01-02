import { ChallengeVerifyDto } from '@domain/dtos';
import { ICredentials } from '@domain/dtos/interfaces';

/**
 * Interface for a service which handles all challenge related operations
 */
export interface IChallengeService {
	/**
	 * Should create a SMS challenge for the given user
	 * @param credentials Credentials of the user who requests the challenge
	 * @returns Id of the issued token
	 */
	requestSmsChallenge(credentials: ICredentials): Promise<string>;

	/**
	 * Should verify the given sms token and the additionaly provided data (e.g. credentials)
	 * @param model Dto containing the nescesary data for verifying the challenge token
	 * @returns A challenge token which confirms the validity of the second factor
	 */
	verifySmsChallenge(model: ChallengeVerifyDto): Promise<string>;
}
