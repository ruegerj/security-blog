import { ResponseState } from './responseState.enum';

/**
 * Base class for all standardized response objects according to the JSend standard
 */
export abstract class ResponseBase<TData> {
	/**
	 * Creates a new response object
	 * @param state JSend state of the response
	 * @param message Optional message which should be included in the response
	 * @param data Optional data payload which should be included in the response
	 */
	constructor(
		state: ResponseState,
		readonly message: string = undefined,
		readonly data: TData = undefined,
	) {
		this.status = this.getStatus(state);
	}

	/**
	 * ResponseState as string
	 */
	readonly status: string;

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
