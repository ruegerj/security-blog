import { Component, Input, OnInit } from '@angular/core';
import { PostState } from '@data/enums';
import { PostSummary } from '@data/models';

@Component({
	selector: 'app-post-summary',
	templateUrl: './post-summary.component.html',
	styleUrls: ['./post-summary.component.scss'],
})
export class PostSummaryComponent implements OnInit {
	/**
	 * Post to display
	 */
	@Input()
	post: PostSummary;

	/**
	 * Boolean which specifies if the state of the posted should be displayed
	 */
	@Input()
	showState: boolean = false;

	constructor() {}

	ngOnInit(): void {}
}
