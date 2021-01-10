import { Injectable, Provider } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsQuery } from '@data/queries';
import { environment } from '@env';
import { filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from '@app/services';

/**
 * Interceptor which automatically attaches the stored access token to the outgoing requests
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	/**
	 * Defines the ignored routes for token injection
	 */
	private readonly ignoredUrls = [
		`${environment.apiBasePath}/auth/login`,
		`${environment.apiBasePath}/auth/refresh`,
		`${environment.apiBasePath}/challenge/get`,
		`${environment.apiBasePath}/challenge/verify`,
	];

	/**
	 * Boolean which indicates if a request is ongoing at the moment
	 */
	private refreshOngoing: boolean = false;

	constructor(
		private credentialsQuery: CredentialsQuery,
		private authenticationService: AuthenticationService,
	) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		// Skip request if ignored
		if (this.isIgnored(request)) {
			return next.handle(request);
		}

		console.log('process', request.url);

		// Queue request when refresh ongoing
		if (this.refreshOngoing) {
			return this.credentialsQuery.token$.pipe(
				filter((token) => token != undefined),
				take(1),
				switchMap((accessToken) => {
					return next.handle(
						this.injectToken(request, accessToken as string),
					);
				}),
			);
		}

		return this.credentialsQuery.validTokenSet$.pipe(
			take(1),
			switchMap((validTokenSet) => {
				console.log('Valid token', validTokenSet);

				if (!validTokenSet) {
					return this.authenticationService
						.refreshToken()
						.pipe(switchMap(() => this.credentialsQuery.token$));
				}

				return this.credentialsQuery.token$;
			}),
			take(1),
			switchMap((token) => {
				console.log('set token', token);

				return next.handle(this.injectToken(request, token || ''));
			}),
		);
	}

	/**
	 * Injects the access token to the request
	 * @param request Request who should have the access token attached
	 * @param token Access token which should be injected
	 */
	private injectToken(
		request: HttpRequest<unknown>,
		token: string,
	): HttpRequest<unknown> {
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	/**
	 * Determines if the given request should be ignore for token injection
	 * @param request Request to check
	 */
	private isIgnored(request: HttpRequest<unknown>): boolean {
		// Don't modify request for external domains
		if (!request.url.startsWith(environment.apiBasePath)) {
			return true;
		}

		console.log(
			'Checking request',
			request.url,
			this.ignoredUrls.some((ignored) => request.url === ignored),
		);

		return this.ignoredUrls.some((ignored) => request.url === ignored);
	}
}

/**
 * Provider for the `TokenInterceptor`
 */
export const TokenInterceptorProvider: Provider = {
	provide: HTTP_INTERCEPTORS,
	useClass: TokenInterceptor,
	multi: true,
};
