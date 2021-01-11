import { Comment } from '@data-access/entities';
import { ICommentRepository } from '@data-access/repositories/interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `ICommentRepository`
 */
export class CommentRepository
	extends RepositoryBase<Comment>
	implements ICommentRepository {
	/**
	 * Returns all comments of the post with the given id including their authors
	 * @param postId Id of the post whose comments are requested
	 */
	getByPostIdWithAuthor(postId: string): Promise<Comment[]> {
		return this.repository.find({
			relations: ['author', 'post'],
			where: {
				post: {
					id: postId,
				},
			},
		});
	}
}
