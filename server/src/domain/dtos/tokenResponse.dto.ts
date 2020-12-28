/**
 * Response DTO containing both access- and refresh-token after a successful login attempt
 */
export class TokenResponseDto {
	/**
	 * Access token for the logged in user
	 */
	accessToken: string;

	/**
	 * Refresh token for the logged in user
	 */
	refreshToken: string;
}
