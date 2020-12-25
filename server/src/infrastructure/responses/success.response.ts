import { ResponseBase } from './response.base';
import { ResponseState } from './responseState.enum';

/**
 * Wrapper object for JSend "success" response
 * @see {@link https://github.com/omniti-labs/jsend#success}
 */
export class SuccessResponse<
	TPayload = unknown
> extends ResponseBase<TPayload> {
	constructor() {
		super(ResponseState.Success);
	}
}
