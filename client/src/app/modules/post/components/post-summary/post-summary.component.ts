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

	lookUpColor(state: PostState): string {
		switch (state) {
			case PostState.Published:
				return 'green';

			case PostState.Hidden:
				return 'grey darken-1';

			case PostState.Deleted:
				return 'red';

			default:
				return '';
		}
	}

	lookUpTitle(state: PostState): string {
		switch (state) {
			case PostState.Published:
				return 'Published';

			case PostState.Hidden:
				return 'Hidden';

			case PostState.Deleted:
				return 'Deleted';

			default:
				return '';
		}
	}
}
