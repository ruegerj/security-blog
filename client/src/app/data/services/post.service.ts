import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePost, Post, PostSummary } from '@data/models';
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
	 * Returns a collection of all post which the current user has written
	 */
	getOwnPosts(): Observable<PostSummary[]> {
		const requestUrl = `${environment.apiBasePath}/posts/own`;

		return this.httpClient.get<PostSummary[]>(requestUrl);
	}

	/**
	 * Returns a colleciton of all posts
	 */
	getAllPosts(): Observable<PostSummary[]> {
		const requestUrl = `${environment.apiBasePath}/posts/all`;

		return this.httpClient.get<PostSummary[]>(requestUrl);
	}

	/**
	 * Fetches the detailed post with the given id
	 * @param id Id of the requested post
	 */
	getById(id: string): Observable<Post> {
		const requestUrl = `${environment.apiBasePath}/posts/${id}`;

		return this.httpClient.get<Post>(requestUrl);
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
