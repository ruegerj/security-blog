/**
 * Response wrapper for the backend API for the JSend status
 */
export interface ApiResponse<TPayload extends Record<string, unknown> = {}> {
	/**
	 * Status of the response
	 */
	status: ResponseStatus;

	/**
	 * Optional data payload of the response
	 */
	payload?: TPayload;

	/**
	 * Optional message of the response
	 */
	message?: string;
}

/**
 * JSend states the reponse can have => `success`: 2xx / `fail`: 4xx / `error`: 5xx
 */
export type ResponseStatus = 'success' | 'fail' | 'error';
