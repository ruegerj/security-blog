import { Comment } from '@data-access/entities';
import { IRepository } from './repository.if';

/**
 * Interface for all repository implementations for the `Comment` entity
 */
export type ICommentRepository = IRepository<Comment>;
