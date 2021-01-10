import { CreatePostDto, PostSummaryDto } from '@domain/dtos';
import { PostState } from '@domain/dtos/enums';

/**
 * Interface for a service which handles post related operations
 */
export interface IPostService {
	/**
	 * Should return all post summaries which fall in the state criteria
	 * @param states States for which all corresponding posts should be fetched
	 */
	getSummariesByStates(states: PostState[]): Promise<PostSummaryDto[]>;

	/**
	 * Should create a new post based on the provided model
	 * @param model Dto containing the nescessary data for creating a new post
	 * @returns Id of the created post
	 */
	create(model: CreatePostDto): Promise<string>;
}
