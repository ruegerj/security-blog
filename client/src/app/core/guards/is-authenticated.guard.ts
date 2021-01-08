import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthQuery } from '@data/queries';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

/**
 * Guard which checks wether the current user is logged in, if not a redirect to `/login` will be performed
 */
@Injectable({
	providedIn: 'root',
})
export class IsAuthenticatedGuard implements CanActivate {
	constructor(private authQuery: AuthQuery, private router: Router) {}

	canActivate(): Observable<boolean> {
		return this.authQuery.isLoggedIn$.pipe(
			take(1),
			switchMap((isLoggedIn) => {
				if (!isLoggedIn) {
					this.router.navigate(['/login']);
				}

				return of(isLoggedIn);
			}),
		);
	}
}
