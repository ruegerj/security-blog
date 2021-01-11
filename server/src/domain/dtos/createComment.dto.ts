import {
	IsDefined,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from 'class-validator';

/**
 * Dto for creating a comment
 */
export class CreateCommentDto {
	/**
	 * Id of the post for which the comment was written
	 */
	@IsDefined({
		message: 'The post id cannot be emtpy or missing',
	})
	@IsString({
		message: 'The post id must be a string',
	})
	@IsUUID('4', {
		message: 'The post id must be a valid v4 uuid',
	})
	postId: string;

	/**
	 * Message of the comment
	 */
	@IsDefined({
		message: 'The message cannot be emtpy or missing',
	})
	@IsString({
		message: 'The message must be a string',
	})
	@MinLength(2, {
		message: 'The message must be atleast 2 characters long',
	})
	@MaxLength(200, {
		message: 'The message cannot be longer than 200 characters',
	})
	message: string;

	/**
	 * Id of the author of the comment (should be the user which issues the request)
	 */
	authorId: string;
}
