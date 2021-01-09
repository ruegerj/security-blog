import { IsDefined, IsEnum, IsString } from 'class-validator';
import { ChallengeType } from './enums';
import { ICredentials } from './interfaces';

/**
 * Dto which contains the nescessary informations for verifying a challenge token
 */
export class ChallengeVerifyDto implements ICredentials {
	/**
	 * Email address or username of the user
	 */
	@IsDefined({
		message: 'The user identity cannot be emtpy or missing',
	})
	@IsString({
		message: 'The user identity must be a string',
	})
	userIdentity: string;

	/**
	 * Plain text password of the user
	 */
	@IsDefined({
		message: 'The password cannot be emtpy or missing',
	})
	@IsString({
		message: 'The password must be a string',
	})
	password: string;

	/**
	 * Challenge id which was received during the challenge request
	 */
	@IsDefined({
		message: 'The challenge id cannot be emtpy or missing',
	})
	@IsString({
		message: 'The challenge id must be a string',
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
	@IsString({
		message: 'The token must be a string',
	})
	token: string;
}
