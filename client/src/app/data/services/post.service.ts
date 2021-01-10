import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePost, PostSummary } from '@data/models';
import { CreatedResponse } from '@data/models/createdResponse';
import { environment } from '@env';
import { Observable } from 'rxjs';

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

	/**
	 * Creates a new post
	 * @param post Post which should be created
	 */
	create(post: CreatePost): Observable<CreatedResponse> {
		const requestUrl = `${environment.apiBasePath}/posts`;

		return this.httpClient.post<CreatedResponse>(requestUrl, post);
	}
}
