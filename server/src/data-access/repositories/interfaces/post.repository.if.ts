import { IRepository } from '@data-access/repositories/interfaces';
import { Post } from '../../entities/post';

/**
 * Interface for all repository implementations for the `Post` entity
 */
export type IPostRepository = IRepository<Post>;
