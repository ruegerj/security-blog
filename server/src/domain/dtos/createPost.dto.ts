import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Dto which is used in order to create posts
 */
export class CreatePostDto {
	/**
	 * Title of the post
	 */
	@IsDefined({
		message: 'The title cannot be emtpy or missing',
	})
	@IsString({
		message: 'The title must be a string',
	})
	@MinLength(10, {
		message: 'The title must be atleast 10 characters long',
	})
	@MaxLength(100, {
		message: 'The post must contain less or equal than 100 characters',
	})
	title: string;

	/**
	 * Content of the post
	 */
	@IsDefined({
		message: 'The conent cannot be emtpy or missing',
	})
	@IsString({
		message: 'The content must be a string',
	})
	content: string;

	/**
	 * Id of the author (should be the current user)
	 */
	authorId: string;
}
