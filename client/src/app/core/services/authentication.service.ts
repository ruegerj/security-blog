import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { BehaviorSubject, Observable } from 'rxjs';
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
	private userCredentials = new BehaviorSubject<Credentials>({
		email: '',
		password: '',
	});

	/**
	 * Latest challenge the user has issued
	 */
	private challenge: Challenge = {
		challengeId: '',
	};

	constructor(private httpClient: HttpClient) {}

	/**
	 * Returns an observable for the current user credentials
	 */
	getCredentials(): Observable<Credentials> {
		return this.userCredentials.asObservable();
	}

	/**
	 * Requests a challenge for the given user and type
	 * @param credentials Credentials of the user for which the challenge should be requested
	 * @param type Type of the requested challenge
	 */
	requestChallenge(
		credentials: Credentials,
		type: ChallengeType,
	): Observable<Challenge> {
		let challengeResult: Observable<Challenge>;

		switch (type) {
			case ChallengeType.SMS:
				challengeResult = this.requestSmsChallenge(credentials);
				break;

			default:
				throw new Error('Unsupported challenge type');
		}

		// Register lastest challenge localy
		return challengeResult.pipe(
			tap((challenge) => (this.challenge = challenge || this.challenge)),
		);
	}

	/**
	 * Requests a SMS challenge for the given user
	 * @param credentials Credentials of the user for which the challenge should be requested
	 */
	private requestSmsChallenge(
		credentials: Credentials,
	): Observable<Challenge> {
		const requestData = {
			email: credentials.email,
			password: credentials.password,
			type: ChallengeType.SMS,
		};

		const requestUrl = `${environment.apiBasePath}/challenge/get`;

		return this.httpClient.post<Challenge>(requestUrl, requestData);
	}
}
