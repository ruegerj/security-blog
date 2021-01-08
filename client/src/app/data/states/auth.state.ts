import { User } from '../models';

/**
 * Represents the authentication state for the application
 */
export type AuthState = {
	user: User | null;
};
