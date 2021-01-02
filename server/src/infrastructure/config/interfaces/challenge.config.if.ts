/**
 * Interface for the configuration containing all challenge related settings
 */
export interface IChallengeConfig {
	/**
	 * Length the generated sms codes should have
	 */
	smsCodeLength: number;

	/**
	 * Authentication token for the external SMS api
	 */
	smsApiToken: string;

	/**
	 * Base url of the external SMS api
	 */
	smsApiBaseUrl: string;

	/**
	 * Number of miliseconds specifying how long an sms token should be valid
	 */
	smsTokenValidFor: number;
}
