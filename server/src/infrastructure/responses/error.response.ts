import { ResponseBase } from './response.base';
import { ResponseState } from './responseState.enum';

/**
 * Wrapper object for JSend "error" response
 * @see {@link https://github.com/omniti-labs/jsend#error}
 */
export class ErrorResponse<TPayload> extends ResponseBase<TPayload> {
	constructor(message?: string, payload?: TPayload) {
		super(ResponseState.Error, message, payload);
	}
}
