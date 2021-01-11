import { CreatePostDto, UpdatePostDto } from '@domain/dtos';
import { PostState, Role } from '@domain/dtos/enums';
import { IPostService, ITokenService } from '@domain/services/interfaces';
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import {
	authenticate,
	authorize,
	IAuthenticatedUserLocals,
	IOptionalAuthenticatedUserLocals,
	validate,
} from '@infrastructure/middleware';
import { SuccessResponse } from '@infrastructure/responses';
import { compareSync } from 'bcrypt';
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
	 * Endpoint for fetching all own posts
	 */
	async getOwnPosts(req: Request, res: Response): Promise<void> {
		const { user } = res.locals as IAuthenticatedUserLocals;

		const posts = await this.postService.getSummariesByUserId(user.subject);

		const nonDeletedPosts = posts.filter(
			(p) => p.state !== PostState.Deleted,
		);

		res.status(200).json(
			new SuccessResponse().withPayload(nonDeletedPosts),
		);
	}

	/**
	 * Endpoint for fetching all posts
	 */
	async getAllPosts(req: Request, res: Response): Promise<void> {
		const posts = await this.postService.getSummariesByStates([
			PostState.Hidden,
			PostState.Published,
			PostState.Deleted,
		]);

		res.status(200).json(new SuccessResponse().withPayload(posts));
	}

	/**
	 * Endpoint for fetching a post by its id
	 */
	async getById(req: Request, res: Response): Promise<void> {
		const postId = req.params.id;
		const { user } = res.locals as IOptionalAuthenticatedUserLocals;

		if (!postId) {
			throw new BadRequestError('Missing post id');
		}

		const post = await this.postService.getById(postId);

		if (!post) {
			throw new NotFoundError('Could not find requested post');
		}

		// Forbid if anonymous user and post no published
		if (!user && post.state !== PostState.Published) {
			this.logger.warn(
				`Prohibited anonymous user access to the post: ${post.id}`,
				post.id,
			);

			throw new ForbiddenError("Your aren't allowed to see this post");
		}

		// Check if user is allowed to see the post
		if (
			post.author.id != user?.subject &&
			post.state !== PostState.Published &&
			!user?.roles.includes(Role.Admin)
		) {
			this.logger.warn(
				`Prohibited user: ${user.email} access to the post: ${post.id}`,
				post.id,
				user.id,
			);

			throw new ForbiddenError("Your aren't allowed to see this post");
		}

		res.status(200).json(new SuccessResponse().withPayload(post));
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

	/**
	 * Endpoint for updating posts
	 */
	async updatePost(req: Request, res: Response): Promise<void> {
		const { user } = res.locals as IAuthenticatedUserLocals;
		const postId = req.params.id;

		if (!postId) {
			throw new BadRequestError('Missing post id');
		}

		const updateModel = req.body as UpdatePostDto;

		await this.postService.update(postId, updateModel, user);

		res.status(204).send();
	}

	initializeRoutes(): void {
		this.router
			.route('/')
			.get(this.catch(this.getPublishedPosts, this))
			.post(
				authenticate(this.tokenService, this.logger),
				authorize(Role.User, Role.User),
				validate(CreatePostDto),
				this.catch(this.createPost, this),
			);

		this.router.get(
			'/own',
			authenticate(this.tokenService, this.logger),
			authorize(Role.User, Role.Admin),
			this.catch(this.getOwnPosts, this),
		);

		this.router.get(
			'/all',
			authenticate(this.tokenService, this.logger),
			authorize(Role.Admin),
			this.catch(this.getAllPosts, this),
		);

		this.router
			.route('/:id')
			.get(
				authenticate(this.tokenService, this.logger, false),
				this.catch(this.getById, this),
			)
			.patch(
				authenticate(this.tokenService, this.logger),
				authorize(Role.User, Role.Admin),
				validate(UpdatePostDto, true),
				this.catch(this.updatePost, this),
			);
	}
}
