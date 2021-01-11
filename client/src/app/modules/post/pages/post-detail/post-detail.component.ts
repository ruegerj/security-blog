import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/alerts';
import { Post } from '@data/models';
import { PostService } from '@data/services';
import { NGXLogger } from 'ngx-logger';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-post-detail',
	templateUrl: './post-detail.component.html',
	styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
	post$: Observable<Post>;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private postService: PostService,
		private logger: NGXLogger,
		private alertService: AlertService,
	) {}

	ngOnInit(): void {
		// Subscribe for post id
		this.post$ = this.route.paramMap.pipe(
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
