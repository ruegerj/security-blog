import { IAccessToken } from '@domain/dtos/interfaces';
import { ITokenService } from '@domain/services/interfaces';
import { UnauthorizedError } from '@infrastructure/errors';
import { ILogger } from '@infrastructure/logger/interfaces';
import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Returns a middleware which authenticates the current user based on the provided access token,
 * if the autthentication was successful the user information will be added to the `res.locals`
 * @param tokenService TokenService instance for validating access tokens
 * @param logger Logging instance which should be used
 */
export function authenticate(
	tokenService: ITokenService,
	logger: ILogger,
): RequestHandler {
	return async (req: Request, res: Response, next: NextFunction) => {
		const authorizationHeader = req.headers.authorization;

		// No authorization header received => abort request
		if (!authorizationHeader) {
			logger.warn(
				'Failed authentication due to missing Authorization header',
			);

			return next(
				new UnauthorizedError(
					'Missing authorization header with bearer token',
				),
			);
		}

		// Expected authorization header pattern => Bearer <token>
		const headerPattern = /^[Bb]earer ([a-zA-Z0-9-_.]+)/;

		const headerMatch = authorizationHeader.match(headerPattern);

		// Header doesn't comes in expected pattern => abort request
		if (!headerMatch) {
			logger.warn(
				'Failed authentication due to malformed authorization header',
			);

			return next(
				new UnauthorizedError(
					'Malformed authorization header, expected structure: Bearer <token>',
				),
			);
		}

		const accessToken = headerMatch[1]; // First match group => token

		const validatedToken = await tokenService.verifyAccessToken(
			accessToken,
		);

		// Invalid access token => abort request
		if (!validatedToken.valid) {
			logger.warn(
				`Failed authentication due to invalid access token, reason: ${validatedToken.reason}`,
			);

			return next(
				new UnauthorizedError(
					`Invalid access token, reason: ${validatedToken.reason}`,
				),
			);
		}

		// Register access token data in the response
		(res.locals as IAuthenticatedUserLocals).user = validatedToken.payload;

		next();
	};
}

/**
 * Interface for the `res.locals` after the `authenticate()` middlware was ran
 */
export interface IAuthenticatedUserLocals extends Record<string, unknown> {
	/**
	 * Data about the authenticated user which submitted the current request
	 */
	user: IAccessToken;
}
