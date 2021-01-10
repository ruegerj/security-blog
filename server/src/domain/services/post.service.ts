import { Post } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { IUnitOfWork } from '@data-access/uow/interfaces';
import { CreatePostDto, PostDetailDto, PostSummaryDto } from '@domain/dtos';
import { PostState } from '@domain/dtos/enums';
import { BadRequestError } from '@infrastructure/errors';
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
}
