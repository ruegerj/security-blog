/**
 * Interface for a service which is able to send sms
 */
export interface ISmsService {
	/**
	 * Should send the given message to the given number as a sms
	 * @param message Message of the sms
	 * @param number Phone number to which the sms shall be sendt
	 */
	send(message: string, number: string): Promise<void>;
}
