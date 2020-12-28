import { RoleDto, UserDto, ValidatedTokenDto } from '@domain/dtos';
import { ChallengeType } from '@domain/dtos/enums';
import {
	IAccessToken,
	IChallengeToken,
	IRefreshToken,
} from '@domain/dtos/interfaces';

/**
 * Interface for a service for any (auth) token related operations
 */
export interface ITokenService {
	/**
	 * Should issue a short term access token for the provided user
	 * @param user User information for the token generation
	 * @param roles List of all roles which are assigned to the user
	 * @returns Generated access token
	 */
	issueAccessToken(user: UserDto, roles: RoleDto[]): Promise<string>;

	/**
	 * Should verify the given access token
	 * @param token Access token to verify
	 * @param user If specified it'll be checked if the token was orginaly issued for the provided user
	 * @returns Token dto which specifies if the token is valid or why not
	 */
	verifyAccessToken(
		token: string,
		user?: UserDto,
	): Promise<ValidatedTokenDto<IAccessToken>>;

	/**
	 * Should issue a long term refresh token for the provided user
	 * @param user User information for the token generation
	 * @returns Generated refresh token
	 */
	issueRefreshToken(user: UserDto): Promise<string>;

	/**
	 * Should verify the given refresh token
	 * @param token Refresh token to verify
	 * @param user If specified it'll be checked if the token was orginaly issued for the provided user
	 * @returns Token dto which specifies if the token is valid or why not
	 */
	verifyRefreshToken(
		token: string,
		user?: UserDto,
	): Promise<ValidatedTokenDto<IRefreshToken>>;

	/**
	 * Should issue a challenge token for the given type
	 * @param user User information for the token generation
	 * @param type Type of the challenge for which a token should be issued
	 * @returns Generated token
	 */
	issueChallengeToken(user: UserDto, type: ChallengeType): Promise<string>;

	/**
	 * Should verify the given challenge token for the provided user
	 * @param token Challenge token to verify
	 * @param user User which submitted the token (potential owner)
	 * @returns Token dto which specifies if the token is valid or why not
	 */
	verifyChallengeToken(
		token: string,
		user: UserDto,
	): Promise<ValidatedTokenDto<IChallengeToken>>;
}
