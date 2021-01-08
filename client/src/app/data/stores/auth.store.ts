import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from '../models';
import { AuthState } from '../states';

/**
 * Store used for holding the current authenticated user
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<AuthState> {
	constructor() {
		super(initialState);
	}

	/**
	 * Updates the auth state with the given user
	 * @param user User which was logged in
	 */
	login(user: User): void {
		this.update({
			user,
		});
	}

	/**
	 * Resets the auth state to the inital state e.g. removes the stored user
	 */
	logout(): void {
		this.update(initialState);
	}
}

export const initialState: AuthState = {
	user: null,
};
