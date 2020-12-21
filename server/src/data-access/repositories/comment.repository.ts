import { Comment } from '@data-access/entities';
import { ICommentRepository } from '@data-access/repositories/interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `ICommentRepository`
 */
export class CommentRepository
	extends RepositoryBase<Comment>
	implements ICommentRepository {}
