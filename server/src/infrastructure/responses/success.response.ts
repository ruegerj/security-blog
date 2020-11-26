import { ResponseBase } from './response.base';
import { ResponseState } from './responseState.enum';

/**
 * Wrapper object for JSend "success" response
 * @see {@link https://github.com/omniti-labs/jsend#success}
 */
export class SuccessResponse<TPayload> extends ResponseBase<TPayload> {
	constructor(message?: string, payload?: TPayload) {
		super(ResponseState.Success, message, payload);
	}
}
