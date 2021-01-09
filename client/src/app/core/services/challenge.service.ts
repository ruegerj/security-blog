import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChallengeType } from '@data/enums';
import { ChallengeToken } from '@data/models';
import { Challenge } from '@data/models/challenge';
import { CredentialsQuery } from '@data/queries';
import { environment } from '@env';
import { NGXLogger } from 'ngx-logger';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

/**
 * Service for handling challenge (second authentication factor) related operations
 */
@Injectable({
	providedIn: 'root',
})
export class ChallengeService {
	/**
	 * Latest challenge-id the user has issued
	 */
	private challengeId?: string;

	constructor(
		private httpClient: HttpClient,
		private credentialsQuery: CredentialsQuery,
		private logger: NGXLogger,
	) {}

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
					userIdentity: credentials.userIdentity,
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
	verifySmsChallenge(code: string): Observable<ChallengeToken> {
		return this.credentialsQuery.credentials$.pipe(
			take(1),
			switchMap((credentials) => {
				if (!credentials) {
					return throwError('Missing user credentials');
				}

				const requestData = {
					userIdentity: credentials.userIdentity,
					password: credentials.password,
					challengeId: this.challengeId,
					type: ChallengeType.SMS,
					token: code,
				};

				const requestUrl = `${environment.apiBasePath}/challenge/verify`;

				return this.httpClient
					.post<ChallengeToken>(requestUrl, requestData)
					.pipe(
						tap(() => {
							// Assign challenge token / reset challengeId
							this.challengeId = undefined;

							this.logger.info(
								`Successfuly verified challenge of type: ${ChallengeType.SMS}`,
							);
						}),
					);
			}),
		);
	}
}
