import {
	CreatePostDto,
	PostDetailDto,
	PostSummaryDto,
	UpdatePostDto,
} from '@domain/dtos';
import { PostState } from '@domain/dtos/enums';
import { IAccessToken } from '@domain/dtos/interfaces';

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
	 * Should return all post summaries for the author with the given id
	 * @param userId Id of the user for which all posts should be fetched
	 */
	getSummariesByUserId(userId: string): Promise<PostSummaryDto[]>;

	/**
	 * Should return the detailed informations of the post with the given id
	 * @param id Id of the requested post
	 * @returns Found post or undefined
	 */
	getById(id: string): Promise<PostDetailDto | undefined>;

	/**
	 * Should create a new post based on the provided model
	 * @param model Dto containing the nescessary data for creating a new post
	 * @returns Id of the created post
	 */
	create(model: CreatePostDto): Promise<string>;

	/**
	 * Should update the post with the given id accordingly to the provided model
	 * @param id Id of the post which should be updated
	 * @param model Model containing the new data for the post
	 * @param currentUser Current user which tries to update the post
	 */
	update(
		id: string,
		model: UpdatePostDto,
		currentUser: IAccessToken,
	): Promise<void>;
}
