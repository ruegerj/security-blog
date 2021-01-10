import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { PostSummaryDto } from '@domain/dtos';
import { PostState } from '@domain/dtos/enums';
import { Tokens } from '@infrastructure/ioc';
import { Inject, Service } from 'typedi';
import { IPostService } from './interfaces';

/**
 * Explicit implementation of `IPostService`
 */
@Service({ id: Tokens.IPostService })
export class PostService implements IPostService {
	constructor(
		@Inject(Tokens.IUnitOfWorkFactory)
		private uowFactory: IUnitOfWorkFactory,
	) {}

	/**
	 * Should return all post summaries which fall in the state criteria
	 * @param states States for which all corresponding posts should be fetched
	 */
	async getSummariesByStates(states: PostState[]): Promise<PostSummaryDto[]> {
		const getByStatesUnit = this.uowFactory.create(false);
		await getByStatesUnit.begin();

		const posts = await getByStatesUnit.posts.getByStatesWithAuthor(states);

		await getByStatesUnit.commit();

		return posts.map((p) => {
			return {
				id: p.id,
				title: p.title,
				createdAt: p.createdAt,
				state: p.status,
				author: {
					id: p.author.id,
					username: p.author.username,
				},
			};
		});
	}
}
