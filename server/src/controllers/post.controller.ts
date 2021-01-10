import { CreatePostDto } from '@domain/dtos';
import { PostState } from '@domain/dtos/enums';
import { IPostService, ITokenService } from '@domain/services/interfaces';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import {
	authenticate,
	IAuthenticatedUserLocals,
	validate,
} from '@infrastructure/middleware';
import { SuccessResponse } from '@infrastructure/responses';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { ControllerBase } from './controller.base';

/**
 * Controller for handling post related operations
 */
@Service({ id: Tokens.ControllerBase, multiple: true })
export class PostController extends ControllerBase {
	readonly basePath = '/api/posts';

	constructor(
		@Inject(Tokens.IPostService)
		private postService: IPostService,

		@Inject(Tokens.ITokenService)
		private tokenService: ITokenService,

		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {
		super();
	}

	/**
	 * Endpoint for fetching all published posts
	 */
	async getPublishedPosts(req: Request, res: Response): Promise<void> {
		const posts = await this.postService.getSummariesByStates([
			PostState.Published,
		]);

		res.status(200).json(new SuccessResponse().withPayload(posts));
	}

	/**
	 * Endpoint for creating new posts
	 */
	async createPost(req: Request, res: Response): Promise<void> {
		const { user } = res.locals as IAuthenticatedUserLocals;

		const postModel = req.body as CreatePostDto;
		postModel.authorId = user.id;

		const postId = await this.postService.create(postModel);

		res.status(201).json(
			new SuccessResponse().withPayload({
				id: postId,
			}),
		);
	}

	initializeRoutes(): void {
		this.router
			.route('/')
			.get(this.catch(this.getPublishedPosts, this))
			.post(
				authenticate(this.tokenService, this.logger),
				validate(CreatePostDto),
				this.catch(this.createPost, this),
			);
	}
}
