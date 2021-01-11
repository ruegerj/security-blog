import { Comment } from '@data-access/entities';
import { IRepository } from './repository.if';

/**
 * Interface for all repository implementations for the `Comment` entity
 */
export interface ICommentRepository extends IRepository<Comment> {
	/**
	 * Should return all comments of the post with the given id including their authors
	 * @param postId Id of the post whose comments are requested
	 */
	getByPostIdWithAuthor(postId: string): Promise<Comment[]>;
}
