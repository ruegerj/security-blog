import { Injectable, Provider } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { finalize, tap } from 'rxjs/operators';

/**
 * Interceptor for logging performed http requests
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
	constructor(private logger: NGXLogger) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		const started = Date.now();
		let state: string;

		return next.handle(request).pipe(
			tap(
				(event) =>
					(state =
						event instanceof HttpErrorResponse ? 'successful' : ''),
				(error) => (state = 'failed'),
			),
			finalize(() => {
				const elapsedMS = Date.now() - started;
				const requestLog = `[${request.method}] ${request.urlWithParams} | ${state} | ${elapsedMS} ms`;

				this.logger.debug(requestLog);
			}),
		);
	}
}

/**
 * Provider for the logging interceptor
 */
export const LoggingInterceptorProvider: Provider = {
	provide: HTTP_INTERCEPTORS,
	useClass: LoggingInterceptor,
	multi: true,
};
