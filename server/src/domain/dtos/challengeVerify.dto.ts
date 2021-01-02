import { IsDefined, IsEnum } from 'class-validator';
import { ChallengeType } from './enums';
import { ICredentials } from './interfaces';

/**
 * Dto which contains the nescessary informations for verifying a challenge token
 */
export class ChallengeVerifyDto implements ICredentials {
	/**
	 * Email address of the user
	 */
	@IsDefined({
		message: 'The email cannot be emtpy or missing',
	})
	email: string;

	/**
	 * Plain text password of the user
	 */
	@IsDefined({
		message: 'The password cannot be emtpy or missing',
	})
	password: string;

	/**
	 * Challenge id which was received during the challenge request
	 */
	@IsDefined({
		message: 'The challenge id cannot be emtpy or missing',
	})
	challengeId: string;

	/**
	 * Type of the challenge for which this requests is issued
	 */
	@IsDefined({
		message: 'The challenge type cannot be emtpy or missing',
	})
	@IsEnum(ChallengeType, {
		message: `The challenge type must be one of these values: ${Object.values(
			ChallengeType,
		)}`,
	})
	type: ChallengeType;

	/**
	 * SMS Challenge token which should be verified
	 */
	@IsDefined({
		message: 'The challenge token cannot be emtpy or missing',
	})
	token: string;
}
