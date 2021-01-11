import { AuthorSummaryDto } from './authorSummary.dto';

/**
 * Dto which contains the summary data of a comment
 */
export class CommentSummaryDto {
	id: string;
	createdAt: Date;
	message: string;
	author: AuthorSummaryDto;
}
