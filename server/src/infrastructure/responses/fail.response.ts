import { ResponseBase } from './response.base';
import { ResponseState } from './responseState.enum';

/**
 * Wrapper object for JSend "fail" response
 * @see {@link https://github.com/omniti-labs/jsend#fail}
 */
export class FailResponse<TPayload = unknown> extends ResponseBase<TPayload> {
	constructor() {
		super(ResponseState.Fail);
	}
}
