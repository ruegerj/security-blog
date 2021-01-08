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
	/**
	 * Latest challenge-id the user has issued
	 */
	private challengeId?: string;

	/**
	 * Latest challenge token received from the backend
	 */
	private challengeToken?: string;

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
	 * Requests a SMS challenge for the given user
	 */
	requestSmsChallenge(): Observable<void> {
		return this.credentialsQuery.credentials$.pipe(
			take(1),
			switchMap((credentials) => {
				if (!credentials) {
					return throwError('Missing user credentials');
				}

				const requestData = {
					email: credentials.email,
					password: credentials.password,
					type: ChallengeType.SMS,
				};

				const requestUrl = `${environment.apiBasePath}/challenge/get`;

				return this.httpClient
					.post<Challenge>(requestUrl, requestData)
					.pipe(
						map((challenge) => {
							this.challengeId =
								challenge.challengeId || this.challengeId;

							this.logger.info(
								`Successfuly obtained challenge of type: ${ChallengeType.SMS}`,
							);
						}),
					);
			}),
		);
	}

	/**
	 * Attempts to verify the given sms challenge code
	 * @param code Code received as an sms which should be validated
	 */
	verifySmsChallenge(code: string): Observable<void> {
		return this.credentialsQuery.credentials$.pipe(
			take(1),
			switchMap((credentials) => {
				if (!credentials) {
					return throwError('Missing user credentials');
				}

				const requestData = {
					email: credentials.email,
					password: credentials.password,
					challengeId: this.challengeId,
					type: ChallengeType.SMS,
					token: code,
				};

				const requestUrl = `${environment.apiBasePath}/challenge/verify`;

				return this.httpClient
					.post<ChallengeToken>(requestUrl, requestData)
					.pipe(
						map((token) => {
							// Assign challenge token / reset challengeId
							this.challengeToken =
								token.challengeToken || this.challengeToken;
							this.challengeId = undefined;

							this.logger.info(
								`Successfuly verified challenge of type: ${ChallengeType.SMS}`,
							);
						}),
					);
			}),
		);
	}

	/**
	 * Attemtpts to login the current user with the local credentials and challenge token
	 */
	login(): Observable<void> {
		return this.credentialsQuery.credentials$.pipe(
			take(1),
			switchMap((credentials) => {
				if (!credentials) {
					return throwError('Missing user credentials');
				}

				const requestData = {
					email: credentials.email,
					password: credentials.password,
				};

				const requestUrl = `${environment.apiBasePath}/auth/login`;

				const headers = new HttpHeaders().append(
					'Authorization',
					`authType="${ChallengeType.SMS}" token="${this.challengeToken}"`,
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

							// Reset credentials and challengeToken to prevent eventual leaks
							this.credentialsStore.removeCredentials();
							this.challengeToken = undefined;
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
	 * Logs the current user out and
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
