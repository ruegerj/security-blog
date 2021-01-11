import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/alerts';
import { PostSummary } from '@data/models';
import { PostService } from '@data/services';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	posts$: Observable<PostSummary[]>;

	constructor(
		private postService: PostService,
		private alertService: AlertService,
	) {}

	ngOnInit(): void {
		this.fetchPosts();
	}

	fetchPosts(): void {
		this.posts$ = this.postService.getPublishedPosts().pipe(
			catchError((err) => {
				this.alertService.error('Failed to fetch posts', {
					autoClose: false,
					keepAfterRouteChange: true,
				});

				return of([]);
			}),
		);
	}
}
