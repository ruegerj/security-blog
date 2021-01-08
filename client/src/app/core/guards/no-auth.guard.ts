import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthQuery } from '@data/queries';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

/**
 * Which requires that the user is not logged in, if logged in will be redirected to index
 */
@Injectable({
	providedIn: 'root',
})
export class NoAuthGuard implements CanActivate, CanActivateChild {
	constructor(private router: Router, private authQuery: AuthQuery) {}

	canActivate(): Observable<boolean> {
		return this.canActivateRoute();
	}

	canActivateChild(): Observable<boolean> {
		return this.canActivateRoute();
	}

	private canActivateRoute(): Observable<boolean> {
		return this.authQuery.isLoggedIn$.pipe(
			take(1),
			switchMap((isLoggedIn) => {
				if (isLoggedIn) {
					this.router.navigate(['/']);
				}

				return of(isLoggedIn);
			}),
		);
	}
}
