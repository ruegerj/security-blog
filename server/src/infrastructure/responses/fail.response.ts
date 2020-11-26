import { ResponseBase } from './response.base';
import { ResponseState } from './responseState.enum';

/**
 * Wrapper object for JSend "fail" response
 * @see {@link https://github.com/omniti-labs/jsend#fail}
 */
export class FailResponse<TPayload> extends ResponseBase<TPayload> {
	constructor(message?: string, payload?: TPayload) {
		super(ResponseState.Fail, message, payload);
	}
}
