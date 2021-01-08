import { Injectable } from '@angular/core';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Role } from 'src/app/data/enums';
import { AuthenticatedUser } from 'src/app/data/models';

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
	parseAccessToken(token: string): AuthenticatedUser {
		const claims: AccessTokenClaims = jwtDecode(token);

		return {
			id: claims.sub,
			email: claims.email,
			phone: claims.phone,
			loginExpires: new Date(claims.exp * 1000),
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

	/**
	 * Unix timestampt when the token expires
	 */
	exp: number;

	email: string;
	phone: string;
	roles: string[];
}
