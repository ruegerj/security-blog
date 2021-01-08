import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CredentialsQuery } from '@data/queries';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

/**
 * Guards which requires the credentials to be present in the `CredentialsStore`
 */
@Injectable({
	providedIn: 'root',
})
export class CredentialsRequiredGuard implements CanActivate {
	constructor(
		private router: Router,
		private credentialsQuery: CredentialsQuery,
	) {}

	canActivate(): Observable<boolean> {
		return this.credentialsQuery.credentialsSet$.pipe(
			take(1),
			switchMap((credentialsSet) => {
				if (!credentialsSet) {
					this.router.navigate(['/login']);
				}

				return of(credentialsSet);
			}),
		);
	}
}
