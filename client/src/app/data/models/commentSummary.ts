import { AuthorSummary } from './authorSummary';

/**
 * Summary model for a comment
 */
export class CommentSummary {
	id: string;
	createdAt: Date;
	message: string;
	author: AuthorSummary;
}
