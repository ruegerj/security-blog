/**
 * Interface for any token which can be issued for an user
 */
export interface IToken {
	/**
	 * Id of the token
	 */
	id: string;

	/**
	 * Id of the subject who this token is issued for
	 */
	subject: string;

	/**
	 * Name of the issuer of the token
	 */
	issuer: string;
}
