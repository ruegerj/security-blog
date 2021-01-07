import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChallengeType } from 'src/app/data/enums';
import { Credentials } from 'src/app/data/models';
import { Challenge } from 'src/app/data/models/challenge';

/**
 * Service which handles all authentication related operations
 */
@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	/**
	 * Subject for sharing credentials across components
	 */
	private userCredentials?: Credentials;

	/**
	 * Latest challenge the user has issued
	 */
	private challenge: Challenge = {
		challengeId: '',
	};

	constructor(private httpClient: HttpClient) {}

	/**
	 * Registers the given credentials or overrides the old ones
	 * @param credentials Credentials which should be set
	 */
	setCredentials(credentials: Credentials): void {
		this.userCredentials = credentials;
	}

	/**
	 * Requests a SMS challenge for the given user
	 */
	requestSmsChallenge(): Observable<Challenge> {
		const requestData = {
			...this.userCredentials,
			type: ChallengeType.SMS,
		};

		const requestUrl = `${environment.apiBasePath}/challenge/get`;

		return this.httpClient
			.post<Challenge>(requestUrl, requestData)
			.pipe(
				tap(
					(challenge) =>
						(this.challenge = challenge || this.challenge),
				),
			);
	}
}
