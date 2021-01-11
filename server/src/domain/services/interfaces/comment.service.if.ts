import { CreateCommentDto } from '@domain/dtos';

/**
 * Interface for a service which handles comment related operations
 */
export interface ICommentService {
	/**
	 * Should create a new comment according to the provided model
	 * @param model Model containing the data which is used to create the comment
	 * @returns Id of the created comment
	 */
	create(model: CreateCommentDto): Promise<string>;
}
