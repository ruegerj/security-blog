import { Injectable, Provider } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/data/models';

/**
 * Interceptor which extracts the data payload of the response if the response format is JSend
 */
@Injectable()
export class ParseBodyInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			map((event: HttpEvent<any>) => {
				// Check if response and body exists, is in JSend format and contains a payload
				if (
					event instanceof HttpResponse &&
					event.body &&
					this.isApiResponse(event.body) &&
					event.body.payload
				) {
					// Clone event and set payload of response as body
					return event.clone({
						body: event.body.payload,
					});
				}

				return event;
			}),
		);
	}

	/**
	 * Determines if the given body is in ApiResponse (JSend) format
	 * @param body Response body to check
	 */
	private isApiResponse(body: any | ApiResponse): body is ApiResponse {
		let response = body as ApiResponse;

		return response.status !== undefined && response.payload !== undefined;
	}
}

/**
 * Provider for the `ParseBodyInterceptor`
 */
export const ParseBodyInterceptorProvider: Provider = {
	provide: HTTP_INTERCEPTORS,
	useClass: ParseBodyInterceptor,
	multi: true,
};
