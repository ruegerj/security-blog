import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChallengeType } from 'src/app/data/enums';
import {
	AccessToken,
	AuthenticatedUser,
	ChallengeToken,
	Credentials,
} from 'src/app/data/models';
import { Challenge } from 'src/app/data/models/challenge';
import { JwtService } from './jwt.service';

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
	 * Latest challenge-id the user has issued
	 */
	private challengeId?: string;

	/**
	 * Latest challenge token received from the backend
	 */
	private challengeToken?: string;

	/**
	 * Currently signed in user
	 */
	private authenticatedUser?: AuthenticatedUser;

	constructor(
		private httpClient: HttpClient,
		private jwtService: JwtService,
		private logger: NGXLogger,
	) {}

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

		return this.httpClient.post<Challenge>(requestUrl, requestData).pipe(
			tap((challenge) => {
				this.challengeId = challenge.challengeId || this.challengeId;

				this.logger.info(
					`Successfuly obtained challenge of type: ${ChallengeType.SMS}`,
				);
			}),
		);
	}

	/**
	 * Attempts to verify the given sms challenge code
	 * @param code Code received as an sms which should be validated
	 */
	verifySmsChallenge(code: string): Observable<ChallengeToken> {
		const requestData = {
			...this.userCredentials,
			challengeId: this.challengeId,
			type: ChallengeType.SMS,
			token: code,
		};

		const requestUrl = `${environment.apiBasePath}/challenge/verify`;

		return this.httpClient
			.post<ChallengeToken>(requestUrl, requestData)
			.pipe(
				tap((token) => {
					// Assign challenge token / reset challengeId
					this.challengeToken =
						token.challengeToken || this.challengeToken;
					this.challengeId = undefined;

					this.logger.info(
						`Successfuly verified challenge of type: ${ChallengeType.SMS}`,
					);
				}),
			);
	}

	/**
	 * Attemtpts to login the current user with the local credentials and challenge token
	 */
	login(): Observable<AccessToken> {
		const requestData = {
			...this.userCredentials,
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
				tap((response) => {
					this.authenticatedUser = this.jwtService.parseAccessToken(
						response.token,
					);

					console.log(this.authenticatedUser);

					this.logger.info(
						`Successfuly logged in as: ${this.authenticatedUser.email}`,
					);

					// Reset credentials and challengeToken to prevent eventual leaks
					this.userCredentials = undefined;
					this.challengeToken = undefined;
				}),
			);
	}
}
