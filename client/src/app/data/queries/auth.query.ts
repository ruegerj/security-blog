import { AuthState } from '../states';
import { Query, toBoolean } from '@datorama/akita';
import { AuthStore } from '../stores';
import { Injectable } from '@angular/core';

/**
 * Query for querying the `AuthStore`
 */
@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
	/**
	 * Checks if a user is reqistered in the store
	 */
	isLoggedIn$ = this.select((state) => toBoolean(state.user));

	/**
	 * Returns the registered user in the store
	 */
	authenticatedUser$ = this.select((state) => state.user);

	constructor(protected store: AuthStore) {
		super(store);
	}
}
