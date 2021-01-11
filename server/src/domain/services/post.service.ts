import { Post } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { IUnitOfWork } from '@data-access/uow/interfaces';
import {
	CreatePostDto,
	PostDetailDto,
	PostSummaryDto,
	UpdatePostDto,
} from '@domain/dtos';
import { PostState, Role } from '@domain/dtos/enums';
import { IAccessToken } from '@domain/dtos/interfaces';
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import { IPostService } from './interfaces';

/**
 * Explicit implementation of `IPostService`
 */
@Service({ id: Tokens.IPostService })
export class PostService implements IPostService {
	constructor(
		@Inject(Tokens.IUnitOfWorkFactory)
		private uowFactory: IUnitOfWorkFactory,

		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {}

	/**
	 * Returns all post summaries which fall in the state criteria
	 * @param states States for which all corresponding posts should be fetched
	 */
	async getSummariesByStates(states: PostState[]): Promise<PostSummaryDto[]> {
		const getByStatesUnit = this.uowFactory.create(false);
		await getByStatesUnit.begin();

		const posts = await getByStatesUnit.posts.getByStatesWithAuthor(states);

		await getByStatesUnit.commit();

		return posts.map((p) => {
			return {
				id: p.id,
				title: p.title,
				createdAt: p.createdAt,
				state: p.status,
				author: {
					id: p.author.id,
					username: p.author.username,
				},
			};
		});
	}

	/**
	 * Should return all post summaries for the author with the given id
	 * @param userId Id of the user for which all posts should be fetched
	 */
	async getSummariesByUserId(userId: string): Promise<PostSummaryDto[]> {
		const getByUserIdUnit = this.uowFactory.create(false);
		await getByUserIdUnit.begin();

		const posts = await getByUserIdUnit.posts.getByAuthorId(userId);

		await getByUserIdUnit.commit();

		return posts.map((p) => {
			return {
				id: p.id,
				title: p.title,
				createdAt: p.createdAt,
				state: p.status,
				author: {
					id: p.author.id,
					username: p.author.username,
				},
			};
		});
	}

	/**
	 * Returns the detailed informations of the post with the given id
	 * @param id Id of the requested post
	 * @returns Found post or undefined
	 */
	async getById(id: string): Promise<PostDetailDto | undefined> {
		const getByIdUnit = this.uowFactory.create(false);
		await getByIdUnit.begin();

		const post = await getByIdUnit.posts.getByIdWithAuthor(id);

		if (!post) {
			await getByIdUnit.rollback();

			return undefined;
		}

		await getByIdUnit.commit();

		return {
			id: post.id,
			title: post.title,
			state: post.status,
			createdAt: post.createdAt,
			content: post.content,
			author: {
				id: post.author.id,
				username: post.author.username,
			},
		};
	}

	/**
	 * Creates a new post based on the provided model
	 * @param model Dto containing the nescessary data for creating a new post
	 * @returns Id of the created post
	 */
	async create(model: CreatePostDto): Promise<string> {
		let createUnit: IUnitOfWork;

		try {
			createUnit = this.uowFactory.create(true);
			await createUnit.begin();

			const author = await createUnit.users.getById(model.authorId);

			if (!author) {
				throw new BadRequestError('Invalid author');
			}

			const post = new Post();
			post.createdAt = new Date();
			post.status = PostState.Hidden;
			post.title = model.title;
			post.content = model.content;
			post.author = author;

			const createdPost = await createUnit.posts.add(post);

			await createUnit.commit();

			this.logger.info(
				`User ${author.username} created the post: ${createdPost.title}`,
				createdPost.id,
				author.id,
			);

			return createdPost.id;
		} catch (error) {
			this.logger.error('Encountered error while creating post', error);

			await createUnit?.rollback();

			throw error;
		}
	}

	/**
	 * Updates the post with the given id accordingly to the provided model
	 * @param id Id of the post which should be updated
	 * @param model Model containing the new data for the post
	 * @param currentUser Current user which tries to update the post
	 */
	async update(
		id: string,
		model: UpdatePostDto,
		currentUser: IAccessToken,
	): Promise<void> {
		let updateUnit: IUnitOfWork;

		try {
			updateUnit = this.uowFactory.create(true);
			await updateUnit.begin();

			const post = await updateUnit.posts.getByIdWithAuthor(id);

			if (!post) {
				throw new NotFoundError("Specified post couldn't be found");
			}

			// Check if current user is author or admin
			if (
				this.isUserRole(currentUser) &&
				!this.isAdminRole(currentUser) &&
				!this.isAuthor(post, currentUser)
			) {
				this.logger.warn(
					`User ${currentUser.email} attempted to update post: ${post.id} from the author: ${post.author.email}`,
					post,
					currentUser.subject,
				);

				throw new ForbiddenError(
					"You aren't allowed to update this request",
				);
			}

			// Check if state update is requested
			if (model.state) {
				// Check if new state update isn't pohibited (backwards e.g. Pblished -> Hidden)
				if (
					this.isUserRole(currentUser) &&
					!this.isAdminRole(currentUser) &&
					model.state < post.status
				) {
					this.logger.warn(
						`User ${currentUser.email} attempted to set the state from the post: ${post.id} from ${post.status} to ${model.state}`,
						post,
						currentUser.subject,
					);

					throw new ForbiddenError(
						"You aren't allowed to apply this state",
					);
				}

				// Everything ok => either admin or forward update by author
				post.status = model.state;

				await updateUnit.posts.update(post);
			}

			await updateUnit.commit();

			this.logger.info(
				`User ${currentUser.email} updated the post: ${post.id}`,
				post,
				currentUser.subject,
			);
		} catch (error) {
			this.logger.error('Failed to update a post', error);

			await updateUnit?.rollback();

			throw error;
		}
	}

	// Authorization Helpers

	private isAuthor(post: Post, user: IAccessToken): boolean {
		return post.author.id === user.subject;
	}

	private isUserRole(user: IAccessToken): boolean {
		return user.roles.some((r) => r == Role.User);
	}

	private isAdminRole(user: IAccessToken): boolean {
		return user.roles.some((r) => r == Role.Admin);
	}
}
