import { Comment } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { IUnitOfWork } from '@data-access/uow/interfaces';
import { CommentSummaryDto, CreateCommentDto } from '@domain/dtos';
import { NotFoundError } from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import { ICommentService } from './interfaces';

/**
 * Explicit implementation of `ICommentService`
 */
@Service({ id: Tokens.ICommentService })
export class CommentService implements ICommentService {
	constructor(
		@Inject(Tokens.IUnitOfWorkFactory)
		private uowFactory: IUnitOfWorkFactory,

		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {}

	/**
	 * Should return all comment summaries of the post whith the given id
	 * @param postId Id of the post whose comments are requested
	 */
	async getSummariesByPostId(postId: string): Promise<CommentSummaryDto[]> {
		const getSummariesUnit = this.uowFactory.create(false);
		await getSummariesUnit.begin();

		const posts = await getSummariesUnit.comments.getByPostIdWithAuthor(
			postId,
		);

		await getSummariesUnit.commit();

		return posts.map((p) => {
			return {
				id: p.id,
				createdAt: p.timestamp,
				message: p.message,
				author: {
					id: p.author.id,
					username: p.author.username,
				},
			};
		});
	}

	/**
	 * Creates a new comment according to the provided model
	 * @param model Model containing the data which is used to create the comment
	 * @returns Id of the created comment
	 */
	async create(model: CreateCommentDto): Promise<string> {
		let createUnit: IUnitOfWork;

		try {
			createUnit = this.uowFactory.create(true);
			await createUnit.begin();

			const post = await createUnit.posts.getById(model.postId);

			if (!post) {
				throw new NotFoundError("Specified post doesn't exist");
			}

			const author = await createUnit.users.getById(model.authorId);

			if (!author) {
				throw new NotFoundError("Specified author doens't exist");
			}

			const comment = new Comment();
			comment.message = model.message;
			comment.timestamp = new Date();
			comment.post = post;
			comment.author = author;

			const createdPost = await createUnit.comments.add(comment);

			await createUnit.commit();

			this.logger.info(
				`User ${author.email} wrote a new comment for the post: ${post.title}`,
				comment,
			);

			return createdPost.id;
		} catch (error) {
			this.logger.error(
				'Encountered error while creating comment',
				error,
			);

			await createUnit?.rollback();

			throw error;
		}
	}
}
