import { Post } from '@data-access/entities';
import { IPostRepository } from './interfaces';
import { RepositoryBase } from './repository.base';

/**
 * TypeORM specific implementation of `IPostRepository`
 */
export class PostRepository
	extends RepositoryBase<Post>
	implements IPostRepository {}
