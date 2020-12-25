import { ResponseState } from './responseState.enum';

/**
 * Base class for all standardized response objects according to the JSend standard
 */
export abstract class ResponseBase<TPayload> {
	/**
	 * Creates a new response object
	 * @param state JSend state of the response
	 */
	constructor(state: ResponseState) {
		this.status = this.getStatus(state);
	}

	/**
	 * ResponseState as string
	 */
	readonly status: string;

	/**
	 * Optional message which should be included in the response
	 */
	protected message: string = undefined;

	/**
	 * Optional payload which should be included in the response
	 */
	protected payload: TPayload = undefined;

	/**
	 * Registers the provided payload in the response
	 * @param payload payload which should be included in the response
	 * @returns The current response instance
	 */
	withPayload(payload: TPayload): ResponseBase<TPayload> {
		this.payload = payload;

		return this;
	}

	/**
	 * Registers the provided message in the response
	 * @param message Message which should be included in the response
	 * @returns The current response instance
	 */
	withMessage(message: string): ResponseBase<TPayload> {
		this.message = message;

		return this;
	}

	/**
	 * Converts the provided state to the corresponding string form
	 * @param state State which should be converted to its string representation
	 */
	private getStatus(state: ResponseState): string {
		switch (state) {
			case ResponseState.Success:
				return 'success';

			case ResponseState.Fail:
				return 'fail';

			case ResponseState.Error:
				return 'error';

			default:
				return 'unknown';
		}
	}
}
