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
import { ValidationErrors } from '@data/models';

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

					// Use generic error message for sever errors
					if (errorResponse.status >= 500) {
						errorMessage = 'Something went wrong, try again later';
					} else if (errorResponse.status === 422) {
						// Extract body to expose validation erros, when validation has failed
						const payload = errorResponse.error?.payload;

						return throwError(
							new ValidationErrors(payload?.errors),
						);
					} else {
						// Try extract message from error response or take status text
						errorMessage =
							errorResponse.error['message'] ||
							errorResponse.statusText;
					}
				}

				return throwError(errorMessage);
			}),
		);
	}
}

/**
 * Provider for the `ErrorInterceptor`
 */
export const ErrorInterceptorProvider: Provider = {
	provide: HTTP_INTERCEPTORS,
	useClass: ErrorInterceptor,
	multi: true,
};
