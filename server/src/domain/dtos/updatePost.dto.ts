import { IsDefined, IsEnum } from 'class-validator';
import { PostState } from './enums';

/**
 * Dto used for updating a post
 */
export class UpdatePostDto {
	@IsDefined({
		message: 'The post state cannot be emtpy or missing',
	})
	@IsEnum(PostState, {
		message: `The post state must be one of these values: ${Object.values(
			PostState,
		)}`,
	})
	state?: PostState;
}
