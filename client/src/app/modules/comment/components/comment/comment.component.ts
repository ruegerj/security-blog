import { Component, Input, OnInit } from '@angular/core';
import { CommentSummary } from '@data/models';

@Component({
	selector: 'app-comment',
	templateUrl: './comment.component.html',
	styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
	@Input()
	comment: CommentSummary;

	constructor() {}

	ngOnInit(): void {}
}
