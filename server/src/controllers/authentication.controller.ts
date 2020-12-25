import { SignUpDto } from '@domain/dtos/signUp.dto';
import { IAuthenticationService } from '@domain/services/interfaces';
import { Tokens } from '@infrastructure/ioc';
import { validate } from '@infrastructure/middleware';
import { SuccessResponse } from '@infrastructure/responses';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { ControllerBase } from './controller.base';

/**
 * Controller for all authentication related operations
 */
@Service({ id: Tokens.ControllerBase, multiple: true })
export class AuthenticationController extends ControllerBase {
	readonly basePath = '/api/auth';

	constructor(
		@Inject(Tokens.IAuthenticationService)
		private authenticationService: IAuthenticationService,
	) {
		super();
	}

	/**
	 * Endpoint for signing up new users
	 */
	async signUp(req: Request, res: Response): Promise<void> {
		const signUpDto = req.body as SignUpDto;

		const userId = await this.authenticationService.signUp(signUpDto);

		res.status(201).json(
			new SuccessResponse(undefined, {
				id: userId,
			}),
		);
	}

	protected initializeRoutes(): void {
		this.router.post(
			'/sign-up',
			validate(SignUpDto),
			this.catch(this.signUp, this),
		);
	}
}
