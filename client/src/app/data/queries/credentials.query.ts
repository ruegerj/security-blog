import { Injectable } from '@angular/core';
import { Query, toBoolean } from '@datorama/akita';
import { CredentialsState } from '@data/states';
import { CredentialsStore } from '@data/stores';

/**
 * Query for querying the `CredentialsStore`
 */
@Injectable({ providedIn: 'root' })
export class CredentialsQuery extends Query<CredentialsState> {
	/**
	 * Checks if credentials are set in the store
	 */
	credentialsSet$ = this.select((state) => toBoolean(state.credentials));

	/**
	 * Checks if an access token is set and if its not expired yet
	 */
	validTokenSet$ = this.select((state) =>
		toBoolean(
			state.accessToken &&
				state.accessToken.expiresAt.getTime() > Date.now(),
		),
	);

	/**
	 * Provides the user credentials hold in the store
	 */
	credentials$ = this.select((state) => state.credentials);

	/**
	 * Provides the access token hold in the store
	 */
	token$ = this.select((state) => state.accessToken?.token);

	constructor(protected store: CredentialsStore) {
		super(store);
	}
}
