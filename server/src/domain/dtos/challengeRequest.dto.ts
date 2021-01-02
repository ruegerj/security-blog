import { IsDefined, IsEnum, IsString } from 'class-validator';
import { ChallengeType } from './enums';
import { ICredentials } from './interfaces';

/**
 * Dto which contains the nescessary informations for requesting a challange
 */
export class ChallengeRequestDto implements ICredentials {
	/**
	 * Email address of the user
	 */
	@IsDefined({
		message: 'The email cannot be emtpy or missing',
	})
	@IsString({
		message: 'The email must be a string',
	})
	email: string;

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
}
