import { IToken } from './interfaces';

/**
 * Dto for a token which was validated
 */
export class ValidatedTokenDto<TPayload extends IToken> {
	/**
	 * Boolean indicating if the token is valid
	 */
	valid: boolean;

	/**
	 * Message why the validation fail when token is invalid
	 */
	reason?: string;

	/**
	 * Parsed payload when the token was valid
	 */
	payload?: TPayload;
}
