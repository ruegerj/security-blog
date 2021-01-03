import { LoginDto, SignUpDto } from '@domain/dtos';
import { ChallengeType } from '@domain/dtos/enums';
import { IAuthenticationService } from '@domain/services/interfaces';
import { IConfig } from '@infrastructure/config/interfaces';
import { BadRequestError, UnauthorizedError } from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { validate } from '@infrastructure/middleware';
import { SuccessResponse } from '@infrastructure/responses';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Inject, Service } from 'typedi';
import { ControllerBase } from './controller.base';

/**
 * Controller for all authentication related operations
 */
@Service({ id: Tokens.ControllerBase, multiple: true })
export class AuthenticationController extends ControllerBase {
	/**
	 * Name of the cookie containing a refresh token
	 */
	private readonly refreshCookie = 'refresh';

	readonly basePath = '/api/auth';

	constructor(
		@Inject(Tokens.IAuthenticationService)
		private authenticationService: IAuthenticationService,

		@Inject(Tokens.ILogger)
		private logger: ILogger,

		@Inject(Tokens.IConfig)
		private config: IConfig,
	) {
		super();
	}

	/**
	 * Endpoint for logging in a user
	 */
	async login(req: Request, res: Response): Promise<void> {
		const locals = res.locals as IAuthFactorLocals;

		// Fill model whith header values
		const model = req.body as LoginDto;
		model.token = locals.token;
		model.challengeType = locals.challengeType;

		const tokens = await this.authenticationService.login(model);

		// Set refresh token as cookie
		res.cookie(this.refreshCookie, tokens.refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			path: '/api/auth/refresh',
			secure: !this.config.env.isDevelopment, // Set as secure cookie when not in development
		});

		res.status(200).json(
			new SuccessResponse().withPayload({
				token: tokens.accessToken,
			}),
		);
	}

	/**
	 * Endpoint for refreshing the users access token
	 */
	async refresh(req: Request, res: Response): Promise<void> {
		const refreshToken = req.cookies[this.refreshCookie];

		// No refresh token present => abort as Unauthorized
		if (!refreshToken) {
			throw new UnauthorizedError('No refresh token present');
		}

		const accessToken = await this.authenticationService.refreshAccessToken(
			refreshToken,
		);

		res.status(200).json(
			new SuccessResponse().withPayload({
				token: accessToken,
			}),
		);
	}

	/**
	 * Endpoint for signing up new users
	 */
	async signUp(req: Request, res: Response): Promise<void> {
		const signUpDto = req.body as SignUpDto;

		const userId = await this.authenticationService.signUp(signUpDto);

		res.status(201).json(
			new SuccessResponse().withPayload({
				id: userId,
			}),
		);
	}

	/**
	 * Returns a middleware which demands, that an authorization header in the correct format is set, else it returns a 401 response
	 * @param logger Logger instance which should be used by middleware
	 * @param defaultFactor Factor type which is the default for the second authentication factor
	 */
	private parseAuthorizationHeader(
		logger: ILogger,
		defaultFactor: ChallengeType,
	): RequestHandler {
		return (req: Request, res: Response, next: NextFunction) => {
			const authorizationHeader = req.headers.authorization;

			// If no authorization header received => abort request
			if (!authorizationHeader) {
				logger.info(
					'No authorization header received when expected - Sending error response...',
				);

				res.setHeader(
					'WWW-Authenticate',
					`authType="${defaultFactor}"`,
				);

				return next(new UnauthorizedError());
			}

			// Epxected authorization header pattern => authType="<type>" token="<token>"
			const headerPattern = /^authType="([a-zA-Z]+)"[ ]{0,1}token="([a-zA-Z0-9-_.]+)"$/;

			const headerMatch = authorizationHeader.match(headerPattern);

			// If header value doesn't come in expected patter => abort request
			if (!headerMatch) {
				logger.info(
					'Malformed authorization header received - Sending error response',
				);

				return next(
					new BadRequestError(
						'Authorization header is malformed, expected structure: authType="<type>" token="<token>"',
					),
				);
			}

			// Extract factor data from regexp match
			const factorData: IAuthFactorLocals = {
				challengeType: headerMatch[1] as ChallengeType, // First match group => factor type
				token: headerMatch[2], // Second match group => token
			};

			// Add factor data to res
			res.locals = {
				...res.locals,
				...factorData,
			};

			next();
		};
	}

	initializeRoutes(): void {
		this.router.post(
			'/login',
			validate(LoginDto),
			this.parseAuthorizationHeader(this.logger, ChallengeType.SMS),
			this.catch(this.login, this),
		);

		this.router.post('/refresh', this.catch(this.refresh, this));

		this.router.post(
			'/sign-up',
			validate(SignUpDto),
			this.catch(this.signUp, this),
		);
	}
}

/**
 * Interface for the `req.locals` obj after the `parseAuthorizationHeader()` middleware was ran
 */
interface IAuthFactorLocals extends Record<string, any> {
	/**
	 * Type of the challenge type
	 */
	challengeType: ChallengeType;

	/**
	 * Submitted token for the authentication factor type
	 */
	token: string;
}
