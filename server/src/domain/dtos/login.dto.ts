import { IsDefined } from 'class-validator';
import { ChallengeType } from './enums';
import { ICredentials } from './interfaces';

/**
 * DTO for logging in an user
 */
export class LoginDto implements ICredentials {
	/**
	 * Email address of the user
	 */
	@IsDefined({
		message: 'The email cannot be emtpy or missing',
	})
	email: string;

	/**
	 * Password of the user in plain text
	 */
	@IsDefined({
		message: 'The password cannot be emtpy or missing',
	})
	password: string;

	/**
	 * Type of the second factor challenge
	 */
	challengeType: ChallengeType;

	/**
	 * Token for the specified factor type
	 */
	token: string;
}
