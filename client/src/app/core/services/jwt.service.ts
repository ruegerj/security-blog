import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Role } from '@data/enums';
import { User } from '@data/models';

/**
 * Service for handling Json Web Tokens
 */
@Injectable({
	providedIn: 'root',
})
export class JwtService {
	constructor() {}

	/**
	 * Tries to parse the given access tokens payload to an `AuthenticatedUser`
	 * @param token Access token (JWT) which should be parsed
	 */
	parseAccessToken(token: string): User {
		const claims: AccessTokenClaims = jwtDecode(token);

		return {
			id: claims.sub,
			email: claims.email,
			phone: claims.phone,
			roles: claims.roles as Role[],
		};
	}
}

/**
 * Interface for the payload of an access token
 */
interface AccessTokenClaims {
	/**
	 * Subject of the token (e.g. user id)
	 */
	sub: string;

	email: string;
	phone: string;
	roles: string[];
}
