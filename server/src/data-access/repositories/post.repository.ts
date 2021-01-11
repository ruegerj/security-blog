import { Post, PostState } from '@data-access/entities';
import { In } from 'typeorm';
import { IPostRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `IPostRepository`
 */
export class PostRepository
	extends RepositoryBase<Post>
	implements IPostRepository {
	/**
	 * Should return all post with theire authors which fall in one of the provided states
	 * @param states Collection of states for which the posts should be fetched
	 */
	getByStatesWithAuthor(states: PostState[]): Promise<Post[]> {
		return this.repository.find({
			relations: ['author'],
			where: {
				// title: 'Test Published',
				status: In(states),
			},
		});
	}

	/**
	 * Returns all posts of the author whith the given id
	 * @param authorId Id of the authore whose posts are requested
	 */
	getByAuthorId(authorId: string): Promise<Post[]> {
		return this.repository.find({
			relations: ['author'],
			where: {
				author: {
					id: authorId,
				},
			},
		});
	}

	/**
	 * Returns the post with the given id, including its author
	 * @param id Id of the requested post
	 * @returns Found post or undefined
	 */
	getByIdWithAuthor(id: string): Promise<Post | undefined> {
		return this.repository.findOne({
			relations: ['author'],
			where: {
				id,
			},
		});
	}
}
