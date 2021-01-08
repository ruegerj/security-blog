import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { NGXLogger } from 'ngx-logger';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ChallengeType } from '@data/enums';
import { AccessToken, ChallengeToken, Credentials } from '@data/models';
import { Challenge } from '@data/models/challenge';
import { AuthStore, CredentialsStore } from '@data/stores';
import { JwtService } from './jwt.service';
import { CredentialsQuery } from '@data/queries/credentials.query';

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
							const authenticatedUser = this.jwtService.parseAccessToken(
								response.token,
							);

							const expiresAt = this.jwtService.getExpiryDate(
								response.token,
							);

							// Store user & token in stores
							this.authStore.login(authenticatedUser);
							this.credentialsStore.setAccessToken(
								response.token,
								expiresAt,
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
}
