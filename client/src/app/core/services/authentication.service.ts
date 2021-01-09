import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { NGXLogger } from 'ngx-logger';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ChallengeType } from '@data/enums';
import { AccessToken, ChallengeToken, Credentials, User } from '@data/models';
import { Challenge } from '@data/models/challenge';
import { AuthStore, CredentialsStore } from '@data/stores';
import { AuthQuery, CredentialsQuery } from '@data/queries';
import { JwtService } from './jwt.service';

/**
 * Service which handles all authentication related operations
 */
@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	constructor(
		private httpClient: HttpClient,
		private authStore: AuthStore,
		private credentialsStore: CredentialsStore,
		private authQuery: AuthQuery,
		private credentialsQuery: CredentialsQuery,
		private jwtService: JwtService,
		private logger: NGXLogger,
	) {}

	/**
	 * Registers the given credentials or overrides the old ones
	 * @param credentials Credentials which should be set
	 */
	setCredentials(credentials: Credentials): void {
		this.credentialsStore.setCredentials(credentials);
	}

	/**
	 * Attemtpts to login the current user with the local credentials and challenge token
	 * @param challengeToken Challenge token which was obtained by verifying the challenge (challenge service)
	 */
	login(challengeToken: string): Observable<void> {
		return this.credentialsQuery.credentials$.pipe(
			take(1),
			switchMap((credentials) => {
				if (!credentials) {
					return throwError('Missing user credentials');
				}

				const requestData = {
					userIdentity: credentials.userIdentity,
					password: credentials.password,
				};

				const requestUrl = `${environment.apiBasePath}/auth/login`;

				const headers = new HttpHeaders().append(
					'Authorization',
					`authType="${ChallengeType.SMS}" token="${challengeToken}"`,
				);

				return this.httpClient
					.post<AccessToken>(requestUrl, requestData, {
						headers,
					})
					.pipe(
						map((response) => {
							const authenticatedUser = this.loginUserByToken(
								response.token,
							);

							this.logger.info(
								`Successfuly logged in as: ${authenticatedUser.email}`,
							);

							// Reset credentials to minimize risk of an eventual leak
							this.credentialsStore.removeCredentials();
						}),
					);
			}),
		);
	}

	/**
	 * Attempts to refresh the current access token using the refresh token
	 */
	refreshToken(): Observable<void> {
		const requestUrl = `${environment}/auth/refresh`;

		return this.httpClient.post<AccessToken>(requestUrl, undefined).pipe(
			map((response) => {
				const authenticatedUser = this.loginUserByToken(response.token);

				this.logger.info(
					`Successfuly refreshed token for: ${authenticatedUser.email}`,
				);
			}),
		);
	}

	/**
	 * Logs the current user out and updates the affected stores accordingly
	 */
	logout(): Observable<void> {
		const requestUrl = `${environment}/auth/logout`;

		return this.authQuery.isLoggedIn$.pipe(
			take(1),
			switchMap((isLoggedIn) => {
				if (!isLoggedIn) {
					return throwError(
						'No user logged in, therefore unable to perform logout',
					);
				}

				return this.httpClient.post(requestUrl, undefined).pipe(
					map(() => {
						// Reset user data & access token
						this.authStore.logout();
						this.credentialsStore.revokeAccessToken();
					}),
				);
			}),
		);
	}

	/**
	 * Parses the given token and stores the corresponding user and the token itself accordingly
	 * @param token Access token which should be registered in the application
	 */
	private loginUserByToken(token: string): User {
		const authenticatedUser = this.jwtService.parseAccessToken(token);

		const expiresAt = this.jwtService.getExpiryDate(token);

		// Store user & token in stores
		this.authStore.login(authenticatedUser);
		this.credentialsStore.setAccessToken(token, expiresAt);

		return authenticatedUser;
	}
}
