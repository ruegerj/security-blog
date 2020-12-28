import { IsDefined } from 'class-validator';
import { ChallengeType } from './enums';

/**
 * DTO for logging in an user
 */
export class LoginDto {
	/**
	 * Email address of the user
	 */
	@IsDefined()
	email: string;

	/**
	 * Password of the user in plain text
	 */
	@IsDefined()
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
