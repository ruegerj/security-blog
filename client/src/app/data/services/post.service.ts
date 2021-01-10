import { Injectable } from '@angular/core';
import { PostState } from '@data/enums';
import { PostSummary } from '@data/models';
import { Observable, of, timer } from 'rxjs';
import { switchMap, switchMapTo } from 'rxjs/operators';

/**
 * Service for handling post operations
 */
@Injectable({
	providedIn: 'root',
})
export class PostService {
	constructor() {}

	/**
	 * Returns a collection of all public posts (state: Published)
	 */
	getPublishedPosts(): Observable<PostSummary[]> {
		// Mock implemetation

		return timer(1000).pipe(
			switchMap(() => {
				const posts: PostSummary[] = [
					{
						id: '56442f60-a6ce-4355-bf81-a95705399a6f',
						title: 'How to protect against XSS',
						state: PostState.Deleted,
						createdAt: new Date(1610283216132),
						author: {
							id: 'b345f781-3dc3-4f7a-8226-967be77575f2',
							username: 'ruegerj',
						},
					},
					{
						id: '0a9e6774-4aac-4fa6-ac0c-e41a3e5de208',
						title: 'CSRF vulnerabilities - an analysis',
						state: PostState.Hidden,
						createdAt: new Date(1610283216132),
						author: {
							id: '567a47c3-90aa-4197-87ec-c3a5e81372b3',
							username: 'hechenbl',
						},
					},
					{
						id: '56442f60-a6ce-4355-bf81-a95705399a6f',
						title: 'Anual Security Report',
						state: PostState.Published,
						createdAt: new Date(1610283216132),
						author: {
							id: 'b345f781-3dc3-4f7a-8226-967be77575f2',
							username: 'ruegerj',
						},
					},
					{
						id: '56442f60-a6ce-4355-bf81-a95705399a6f',
						title:
							'XSS Test: <script>alert("hello world")</script>',
						state: PostState.Published,
						createdAt: new Date(1610283216132),
						author: {
							id: 'b345f781-3dc3-4f7a-8226-967be77575f2',
							username: 'ruegerj',
						},
					},
				];

				return of(posts);
			}),
		);
	}
}
