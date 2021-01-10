import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostState } from '@data/enums';
import { PostSummary } from '@data/models';
import { environment } from '@env';
import { Observable, of, timer } from 'rxjs';
import { switchMap, switchMapTo } from 'rxjs/operators';

/**
 * Service for handling post operations
 */
@Injectable({
	providedIn: 'root',
})
export class PostService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Returns a collection of all public posts (state: Published)
	 */
	getPublishedPosts(): Observable<PostSummary[]> {
		const requestUrl = `${environment.apiBasePath}/posts`;

		return this.httpClient.get<PostSummary[]>(requestUrl);
	}
}
