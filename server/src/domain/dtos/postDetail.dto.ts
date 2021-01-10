import { AuthorSummaryDto } from './authorSummary.dto';
import { PostState } from './enums';

/**
 * Dto for the detailed informations about a post
 */
export class PostDetailDto {
	id: string;
	state: PostState;
	createdAt: Date;
	title: string;
	content: string;
	author: AuthorSummaryDto;
}
