import { ChallengeType } from '../enums';
import { IToken } from './token.if';

/**
 * Interface for a challenge token which will be issued after a successful challenge completion
 */
export interface IChallengeToken extends IToken {
	/**
	 * Type of the challenge for which this token was issued
	 */
	type: ChallengeType;
}
