/**
 * Interface for the response of a challenge token
 */
export interface ChallengeToken {
	/**
	 * JWT challenge token as confirmation of the passed challenge
	 */
	challengeToken: string;
}
