/**
 * Interface for the configuration options for the different tokens
 */
export interface IJwtConfig {
	/**
	 * Access token => short term token for accessing the api
	 */
	accessToken: ITokenConfig;

	/**
	 * Refresh token => long term token for refreshing the access token
	 */
	refreshToken: ITokenConfig;

	/**
	 * Challenge token => short term token as confirmation that the second factor/challenge was verified
	 */
	challengeToken: ITokenConfig;
}

/**
 * Interface for the configuration options of a single JWT
 */
export interface ITokenConfig {
	/**
	 * Private key which is used to sign the token
	 */
	key: string;

	/**
	 * Define in which time span from the issue date the token should expire
	 * @example "5m", "24h", "5d"
	 */
	expiresIn: string;
}
