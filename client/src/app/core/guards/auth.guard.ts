import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from '@angular/router';
import { AuthQuery } from '@data/queries';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

/**
 * Guard which requires the user to be authenticated (Authentication) and if specified to have specific roles (Authorization)
 */
@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authQuery: AuthQuery) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<boolean> {
		return forkJoin({
			isLoggedIn: this.authQuery.isLoggedIn$.pipe(take(1)),
			authenticatedUser: this.authQuery.authenticatedUser$.pipe(take(1)),
		}).pipe(
			switchMap(({ isLoggedIn, authenticatedUser }) => {
				// If not logged in or dont exists => redirect to /login
				if (!isLoggedIn || !authenticatedUser) {
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

				// Everything seems fine => grant activation
				return of(true);
			}),
		);
	}
}
