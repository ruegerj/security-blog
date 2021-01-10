import { PostState } from '@data/enums';
import { AuthorSummary } from './authorSummary';

/**
 * Summary of a post
 */
export class PostSummary {
	id: string;
	title: string;
	state: PostState;
	createdAt: Date;
	author: AuthorSummary;
}
