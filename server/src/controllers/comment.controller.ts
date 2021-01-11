import { CreateCommentDto } from '@domain/dtos';
import { Role } from '@domain/dtos/enums';
import { ICommentService, ITokenService } from '@domain/services/interfaces';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import {
	authenticate,
	authorize,
	IAuthenticatedUserLocals,
	validate,
} from '@infrastructure/middleware';
import { SuccessResponse } from '@infrastructure/responses';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { ControllerBase } from './controller.base';

/**
 * Controller for handling comment related operations
 */
@Service({ id: Tokens.ControllerBase, multiple: true })
export class CommentController extends ControllerBase {
	readonly basePath = '/api/comments';

	constructor(
		@Inject(Tokens.ITokenService)
		private tokenService: ITokenService,

		@Inject(Tokens.ICommentService)
		private commentService: ICommentService,

		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {
		super();
	}

	/**
	 * Endpoint for creating comments
	 */
	async createComment(req: Request, res: Response): Promise<void> {
		const { user } = res.locals as IAuthenticatedUserLocals;

		const model = req.body as CreateCommentDto;
		model.authorId = user.subject;

		const commentId = await this.commentService.create(model);

		res.status(201).json(
			new SuccessResponse().withPayload({
				id: commentId,
			}),
		);
	}

	initializeRoutes(): void {
		this.router
			.route('/')
			.post(
				authenticate(this.tokenService, this.logger),
				authorize(Role.User, Role.Admin),
				validate(CreateCommentDto),
				this.catch(this.createComment, this),
			);
	}
}
