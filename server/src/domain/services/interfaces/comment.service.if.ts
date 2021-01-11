import { CommentSummaryDto, CreateCommentDto } from '@domain/dtos';

/**
 * Interface for a service which handles comment related operations
 */
export interface ICommentService {
	/**
	 * Should return all comment summaries of the post whith the given id
	 * @param postId Id of the post whose comments are requested
	 */
	getSummariesByPostId(postId: string): Promise<CommentSummaryDto[]>;

	/**
	 * Should create a new comment according to the provided model
	 * @param model Model containing the data which is used to create the comment
	 * @returns Id of the created comment
	 */
	create(model: CreateCommentDto): Promise<string>;
}
