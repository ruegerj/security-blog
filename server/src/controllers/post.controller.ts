import { PostState } from '@domain/dtos/enums';
import { IPostService } from '@domain/services/interfaces';
import { Tokens } from '@infrastructure/ioc';
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

	initializeRoutes(): void {
		this.router.get('/', this.catch(this.getPublishedPosts, this));
	}
}
