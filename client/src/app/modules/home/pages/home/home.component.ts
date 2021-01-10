import { Component, OnInit } from '@angular/core';
import { PostSummary } from '@data/models';
import { PostService } from '@data/services';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	posts$: Observable<PostSummary[]>;

	constructor(private postService: PostService) {}

	ngOnInit(): void {
		this.fetchPosts();
	}

	fetchPosts(): void {
		this.posts$ = this.postService.getPublishedPosts();
	}
}
