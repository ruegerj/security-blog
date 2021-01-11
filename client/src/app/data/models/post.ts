import { PostState } from '@data/enums';
import { AuthorSummary } from './authorSummary';

/**
 * Model for a detailed post
 */
export class Post {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	state: PostState;
	author: AuthorSummary;
}
