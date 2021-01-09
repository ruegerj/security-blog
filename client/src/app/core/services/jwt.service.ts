import { Injectable } from '@angular/core';
import jwtDecode, { JwtPayload } from 'jwt-decode';
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
			username: claims.username,
			email: claims.email,
			phone: claims.phone,
			roles: claims.roles as Role[],
		};
	}

	/**
	 * Parses the expiry date from the tokens payload
	 * @param token JWT whose expiry is requested
	 * @throws Error no expiry date is present in the tokens payload
	 */
	getExpiryDate(token: string): Date {
		const claims: JwtPayload = jwtDecode(token);

		if (!claims.exp) {
			throw new Error('No "expiresIn" claim present on provided token');
		}

		// Convert unix to date
		return new Date(claims.exp * 1000);
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
	username: string;
	email: string;
	phone: string;
	roles: string[];
}
