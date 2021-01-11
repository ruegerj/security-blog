import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/alerts';
import { PostState } from '@data/enums';
import { Post } from '@data/models';
import { PostService } from '@data/services';
import { NGXLogger } from 'ngx-logger';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-post-detail',
	templateUrl: './post-detail.component.html',
	styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
	applyingState = false;
	post$: Observable<Post | undefined>;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private postService: PostService,
		private logger: NGXLogger,
		private alertService: AlertService,
	) {}

	ngOnInit(): void {
		// Subscribe for post id
		this.post$ = this.fetchPost();
	}

	updateState(post: Post, state: PostState): void {
		// Mock implementation
		this.applyingState = true;

		this.postService
			.applyState(post.id, state)
			.pipe(
				catchError((err) => {
					this.alertService.error('Failed to update post status', {
						keepAfterRouteChange: true,
						autoClose: false,
					});

					// Return unchanged data
					return of(post);
				}),
				finalize(() => (this.applyingState = false)),
			)
			.subscribe(() => {
				this.post$ = this.fetchPost();
			});
	}

	isHidden(post: Post): boolean {
		return post.state === PostState.Hidden;
	}

	isPublished(post: Post): boolean {
		return post.state === PostState.Published;
	}

	isDeleted(post: Post): boolean {
		return post.state === PostState.Deleted;
	}

	private fetchPost(): Observable<Post> {
		return this.route.paramMap.pipe(
			switchMap((paramMap) => {
				const postId = paramMap.get('id');

				if (!postId) {
					this.router.navigate(['/']);
					return EMPTY;
				}

				return this.postService.getById(postId);
			}),
			catchError((err) => {
				this.alertService.error('Failed to load post', {
					keepAfterRouteChange: true,
					autoClose: false,
				});

				this.logger.error('Failed to fetch request', err);

				// Execpt that the user lacks permission => navigate to home
				this.router.navigate(['/']);

				return EMPTY;
			}),
		);
	}
}
