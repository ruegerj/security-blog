import { ResponseBase } from './response.base';
import { ResponseState } from './responseState.enum';

/**
 * Wrapper object for JSend "error" response
 * @see {@link https://github.com/omniti-labs/jsend#error}
 */
export class ErrorResponse<TPayload = unknown> extends ResponseBase<TPayload> {
	constructor() {
		super(ResponseState.Error);
	}
}
