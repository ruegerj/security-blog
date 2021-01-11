import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/alerts';
import { PostSummary } from '@data/models';
import { PostService } from '@data/services';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
	posts$: Observable<PostSummary[]>;

	constructor(
		private postService: PostService,
		private alertService: AlertService,
	) {}

	ngOnInit(): void {
		this.fetchPosts();
	}

	fetchPosts(): void {
		this.posts$ = this.postService.getAllPosts().pipe(
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
