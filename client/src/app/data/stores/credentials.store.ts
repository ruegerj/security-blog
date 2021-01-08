import { Injectable } from '@angular/core';
import { Credentials } from '@data/models';
import { CredentialsState } from '@data/states';
import { Store, StoreConfig } from '@datorama/akita';

/**
 * Store for holding the users credentials during login and the access tokens
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'credentials' })
export class CredentialsStore extends Store<CredentialsState> {
	constructor() {
		super(initialState);
	}

	/**
	 * Updates the stored user credentials with the given ones
	 * @param userCredentials Credentials of the user which should be set
	 */
	setCredentials(userCredentials: Credentials): void {
		this.update({
			credentials: userCredentials,
		});
	}

	/**
	 * Resets the stored user credentials to the initial state
	 */
	removeCredentials(): void {
		this.update({
			credentials: initialState.credentials,
		});
	}

	/**
	 * Updates the stored access token with the given one
	 * @param token Access token which should be set
	 * @param expiresAt Timestamp when the given access token expires
	 *
	 */
	setAccessToken(token: string, expiresAt: Date): void {
		this.update({
			accessToken: {
				token,
				expiresAt,
			},
		});
	}

	/**
	 * Resets the stored access token to the initial state
	 */
	revokeAccessToken(): void {
		this.update({
			accessToken: initialState.accessToken,
		});
	}
}

const initialState: CredentialsState = {
	accessToken: null,
	credentials: null,
};
