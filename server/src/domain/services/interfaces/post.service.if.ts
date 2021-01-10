import { PostSummaryDto } from '@domain/dtos';
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
}
