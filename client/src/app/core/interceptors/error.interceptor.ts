import { Injectable, Provider } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

/**
 * Interceptor for handling failed requests or errors during the request
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private logger: NGXLogger) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((errorResponse: HttpErrorResponse) => {
				let errorMessage: string;

				// Check if error is client-side or network related
				if (errorResponse.error instanceof ErrorEvent) {
					this.logger.error(
						'Client side or network related error while sending request',
						errorResponse.error,
					);

					errorMessage = 'Something went wrong, try again later'; // Throw generic error
				} else {
					this.logger.error(
						`Request failed, code: ${errorResponse.status}`,
						errorResponse.error,
					);

					// Try extract message from error response or take status text
					errorMessage =
						errorResponse.error['message'] ||
						errorResponse.statusText;
				}

				return throwError(errorMessage);
			}),
		);
	}
}

/**
 * Provider for the error interceptor
 */
export const ErrorInterceptorProvider: Provider = {
	provide: HTTP_INTERCEPTORS,
	useClass: ErrorInterceptor,
	multi: true,
};
