import { IRepository } from '@data-access/repositories/interfaces';
import { Post, PostState } from '../../entities/post';

/**
 * Interface for all repository implementations for the `Post` entity
 */
export interface IPostRepository extends IRepository<Post> {
	/**
	 * Should return all post with theire authors which fall in one of the provided states
	 * @param states Collection of states for which the posts should be fetched
	 */
	getByStatesWithAuthor(states: PostState[]): Promise<Post[]>;

	/**
	 * Should return the post with the given id, including its author
	 * @param id Id of the requested post
	 * @returns Found post or undefined
	 */
	getByIdWithAuthor(id: string): Promise<Post | undefined>;
}
