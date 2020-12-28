import { IToken } from './token.if';

/**
 * Refresh token which will be issued for renewing access tokens
 */
export interface IRefreshToken extends IToken {
	/**
	 * Token version at the time when the token was issued
	 */
	version: number;
}
