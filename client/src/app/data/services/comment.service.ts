import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentSummary, CreateComment } from '@data/models';
import { CreatedResponse } from '@data/models/createdResponse';
import { environment } from '@env';
import { Observable } from 'rxjs';

/**
 * Service for handling comment related operations
 */
@Injectable({
	providedIn: 'root',
})
export class CommentService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Fetches all comments for the post with the given id
	 * @param postId Id of the post whose comments are requested
	 */
	getForPost(postId: string): Observable<CommentSummary[]> {
		const requestUrl = `${environment.apiBasePath}/comments/post/${postId}`;

		return this.httpClient.get<CommentSummary[]>(requestUrl);
	}

	/**
	 * Creates a new comment
	 * @param comment Comment which should be created
	 */
	create(comment: CreateComment): Observable<CreatedResponse> {
		const requestUrl = `${environment.apiBasePath}/comments`;

		return this.httpClient.post<CreatedResponse>(requestUrl, comment);
	}
}
