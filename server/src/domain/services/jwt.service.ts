import jwt, { Algorithm, VerifyOptions } from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';
import { UserDto, RoleDto, ValidatedTokenDto } from '@domain/dtos';
import { ChallengeType } from '@domain/dtos/enums';
import { Tokens } from '@infrastructure/ioc';
import { Inject, Service } from 'typedi';
import { ITokenService } from './interfaces';
import { IConfig, ITokenConfig } from '@infrastructure/config/interfaces';
import {
	IAccessToken,
	IRefreshToken,
	IChallengeToken,
	IToken,
} from '@domain/dtos/interfaces';
import { ILogger } from '@infrastructure/logger/interfaces';

/**
 * JWT specific implementation of `ITokenService`
 */
@Service({ id: Tokens.ITokenService })
export class JwtService implements ITokenService {
	private readonly hashingAlgorithm: Algorithm = 'HS256';

	constructor(
		@Inject(Tokens.IConfig)
		private config: IConfig,

		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {}

	/**
	 * Issues a short term jwt access token for the provided user
	 * @param user User information for the token generation
	 * @param roles List of all roles which are assigned to the user
	 * @returns Generated access token
	 */
	async issueAccessToken(user: UserDto, roles: RoleDto[]): Promise<string> {
		const claims: Record<string, unknown> = {
			sub: user.id,
			username: user.username,
			email: user.email,
			phone: user.phone,
			roles: roles.map((r) => r.name),
		};

		return this.issueToken(claims, this.config.jwt.accessToken);
	}

	/**
	 * Issues a long term jwt refresh token for the provided user
	 * @param user User information for the token generation
	 * @returns Generated refresh token
	 */
	async issueRefreshToken(user: UserDto): Promise<string> {
		const claims: Record<string, unknown> = {
			sub: user.id,
			version: user.tokenVersion,
		};

		return this.issueToken(claims, this.config.jwt.refreshToken);
	}

	/**
	 * Issues a challenge token for the given type and user
	 * @param user User information for the token generation
	 * @param type Type of the challenge for which a token should be issued
	 * @returns Generated token
	 */
	async issueChallengeToken(
		user: UserDto,
		type: ChallengeType,
	): Promise<string> {
		const claims: Record<string, unknown> = {
			sub: user.id,
			type,
		};

		return this.issueToken(claims, this.config.jwt.challengeToken);
	}

	/**
	 * Verifies the given access token
	 * @param token Access token to verify
	 * @param user If specified it'll be checked if the token was orginaly issued for the provided user
	 * @returns Token dto which specifies if the token is valid or why not
	 */
	verifyAccessToken(
		token: string,
		user?: UserDto,
	): Promise<ValidatedTokenDto<IAccessToken>> {
		return new Promise<ValidatedTokenDto<IAccessToken>>((resolve) => {
			const signingKey = this.config.jwt.accessToken.key;

			jwt.verify(
				token,
				signingKey,
				this.getVerificationOptions(user),
				(err, decoded: Record<string, any>) => {
					const validated = new ValidatedTokenDto<IAccessToken>();

					if (err) {
						validated.valid = false;
						validated.reason = err.message;

						this.logger.warn(
							`Validation failed for access token`,
							token,
							err,
							user,
						);

						return resolve(validated);
					}

					validated.valid = true;

					validated.payload = {
						...this.parseToken(decoded),
						email: decoded.email,
						phone: decoded.phone,
						roles: decoded.roles,
					};

					resolve(validated);
				},
			);
		});
	}

	/**
	 * Verifies the given refresh token
	 * @param token Refresh token to verify
	 * @param user If specified it'll be checked if the token was orginaly issued for the provided user
	 * @returns Token dto which specifies if the token is valid or why not
	 */
	verifyRefreshToken(
		token: string,
		user?: UserDto,
	): Promise<ValidatedTokenDto<IRefreshToken>> {
		return new Promise<ValidatedTokenDto<IRefreshToken>>((resolve) => {
			const signingKey = this.config.jwt.refreshToken.key;

			jwt.verify(
				token,
				signingKey,
				this.getVerificationOptions(user),
				(err, decoded: Record<string, any>) => {
					const validated = new ValidatedTokenDto<IRefreshToken>();

					if (err) {
						validated.valid = false;
						validated.reason = err.message;

						this.logger.warn(
							`Validation failed for refresh token`,
							token,
							err,
							user,
						);

						return resolve(validated);
					}

					validated.valid = true;
					validated.payload = {
						...this.parseToken(decoded),
						version: decoded.version,
					};

					resolve(validated);
				},
			);
		});
	}

	/**
	 * Verifies the given challenge token for the provided user
	 * @param token Challenge token to verify
	 * @param user User which submitted the token (potential owner)
	 * @returns Token dto which specifies if the token is valid or why not
	 */
	verifyChallengeToken(
		token: string,
		user: UserDto,
	): Promise<ValidatedTokenDto<IChallengeToken>> {
		return new Promise<ValidatedTokenDto<IChallengeToken>>((resolve) => {
			const signingKey = this.config.jwt.challengeToken.key;

			jwt.verify(
				token,
				signingKey,
				this.getVerificationOptions(user),
				(err, decoded: Record<string, any>) => {
					const validated = new ValidatedTokenDto<IChallengeToken>();

					if (err) {
						validated.valid = false;
						validated.reason = err.message;

						this.logger.warn(
							`Validation for challenge token failed`,
							token,
							err,
							user,
						);

						return resolve(validated);
					}

					validated.valid = true;
					validated.payload = {
						...this.parseToken(decoded),
						type: decoded.type,
					};

					resolve(validated);
				},
			);
		});
	}

	/**
	 * Creates a new JWT for the given claims, options and signs it
	 * @param claims Claims which should be included in the payload
	 * @param options Token options for signing the token
	 * @returns Written and signed token
	 */
	private issueToken(
		claims: Record<string, unknown>,
		options: ITokenConfig,
	): string {
		return jwt.sign(claims, options.key, {
			algorithm: this.hashingAlgorithm,
			expiresIn: options.expiresIn,
			jwtid: uuidV4(),
			issuer: this.config.server.hostname,
		});
	}

	/**
	 * Returns the jwt verificaiton options
	 * @param user Optional user, if provided subject will be checked
	 * @returns Verfication options for tokens issued by this service
	 */
	private getVerificationOptions(user?: UserDto): VerifyOptions {
		return {
			algorithms: [this.hashingAlgorithm],
			issuer: this.config.server.hostname,
			subject: user?.id,
			ignoreExpiration: false,
			clockTolerance: 0,
		};
	}

	/**
	 * Parses the decoded token payload into an `IToken`
	 * @param payload Decoded token payload which should be parsed
	 */
	private parseToken(payload: Record<string, any>): IToken {
		return {
			id: payload.id,
			issuer: payload.iss,
			subject: payload.sub,
		};
	}
}
