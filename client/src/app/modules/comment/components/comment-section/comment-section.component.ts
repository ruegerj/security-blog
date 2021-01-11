import { Component, Input, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { AlertService } from '@app/alerts';
import { CommentSummary, CreateComment } from '@data/models';
import { CommentService } from '@data/services';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-comment-section',
	templateUrl: './comment-section.component.html',
	styleUrls: ['./comment-section.component.scss'],
})
export class CommentSectionComponent implements OnInit {
	@Input()
	postId: string;

	creatingComment: boolean;
	commentForm: FormGroup;
	alertId = 'create-comment-alert';

	comments$: Observable<CommentSummary[]>;

	constructor(
		private formBuilder: FormBuilder,
		private commentService: CommentService,
		private alertService: AlertService,
	) {}

	ngOnInit(): void {
		this.refreshComments();
		this.commentForm = this.createForm();
	}

	refreshComments(): void {
		this.comments$ = this.fetchComments();
	}

	createComment(): void {
		if (this.commentForm.invalid) {
			return;
		}

		this.alertService.clear(this.alertId);

		this.creatingComment = true;

		const comment: CreateComment = {
			postId: this.postId,
			message: this.messageControl?.value,
		};

		this.comments$ = this.commentService.create(comment).pipe(
			finalize(() => {
				this.creatingComment = false;
			}),
			switchMap(() => {
				this.messageControl?.setValue('');

				return this.fetchComments();
			}),
			catchError((err) => {
				this.alertService.error('Failed to create comment', {
					autoClose: false,
					id: this.alertId,
				});

				return of([]);
			}),
		);
	}

	get messageControl(): FormControl {
		return this.commentForm.get('message') as FormControl;
	}

	private fetchComments(): Observable<CommentSummary[]> {
		return this.commentService.getForPost(this.postId).pipe(
			catchError((err) => {
				this.alertService.error('Failed to load comments', {
					autoClose: false,
					keepAfterRouteChange: false,
				});

				return of([]);
			}),
		);
	}

	private createForm(): FormGroup {
		return this.formBuilder.group({
			message: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(200),
				],
			],
		});
	}
}
