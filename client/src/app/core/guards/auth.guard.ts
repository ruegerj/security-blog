import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from '@angular/router';
import { AuthenticationService } from '@app/services';
import { AuthQuery } from '@data/queries';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

/**
 * Guard which requires the user to be authenticated (Authentication) and if specified to have specific roles (Authorization)
 */
@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private authQuery: AuthQuery,
		private authenticationService: AuthenticationService,
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<boolean> {
		return this.authQuery.isLoggedIn$.pipe(
			switchMap((isLoggedIn) => {
				// Not logged in => attempt token refresh
				if (!isLoggedIn) {
					return this.authenticationService.refreshToken();
				}

				return this.authQuery.authenticatedUser$;
			}),
			switchMap((authenticatedUser) => {
				// No user in store or token refresh failed => redirect to login, deny route access
				if (!authenticatedUser) {
					this.router.navigate(['/login'], {
						queryParams: {
							redirectUrl: state.url,
						},
					});
					return of(false);
				}

				// If no role requirement of route gets satified => unauthorized, redirect to index
				if (
					route.data.roles &&
					!authenticatedUser.roles.some((r) =>
						route.data.roles.includes(r),
					)
				) {
					this.router.navigate(['/']);
					return of(false);
				}

				// Everything seems fine => grant route access
				return of(true);
			}),
		);
	}
}
