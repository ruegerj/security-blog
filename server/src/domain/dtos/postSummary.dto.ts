import { PostState } from './enums';
import { AuthorSummaryDto } from './authorSummary.dto';

/**
 * Dto which contains the summary information from a post
 */
export class PostSummaryDto {
	id: string;
	title: string;
	state: PostState;
	createdAt: Date;
	author: AuthorSummaryDto;
}
