import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@app/alerts';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CreatePost } from '@data/models';
import { CreatedResponse } from '@data/models/createdResponse';
import { PostService } from '@data/services';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
	selector: 'app-create-post',
	templateUrl: './create-post.component.html',
	styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
	creating: boolean = false;
	alertId = 'create-post-alert';

	// Editor and config
	editor = ClassicEditor;
	config = {
		toolbar: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'blockQuote',
		],
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
				},
				{
					model: 'heading1',
					view: 'h2',
					title: 'Heading 1',
				},
				{
					model: 'heading2',
					view: 'h3',
					title: 'Heading 2',
				},
				{
					model: 'heading3',
					view: 'h4',
					title: 'Heading 3',
				},
				{
					model: 'heading4',
					view: 'h5',
					title: 'Heading 4',
				},
				{
					model: 'heading5',
					view: 'h6',
					title: 'Heading 5',
				},
			],
		},
	};
	newPostForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private alertService: AlertService,
		private postService: PostService,
		private logger: NGXLogger,
	) {}

	ngOnInit(): void {
		this.newPostForm = this.createForm();
	}

	createPost(): void {
		// Abort when form invalid
		if (this.newPostForm.invalid) {
			return;
		}

		// Clear local alerts
		this.alertService.clear(this.alertId);

		const post: CreatePost = {
			title: this.titleControl?.value,
			content: this.contentControl?.value,
		};

		this.postService
			.create(post)
			.pipe(
				catchError((err) => {
					// Log and alert the error
					this.logger.error(`Error while creating post`, err);

					this.alertService.error(err, {
						id: this.alertId,
					});

					const emptyResponse: CreatedResponse = {
						id: undefined,
					};

					return of(emptyResponse);
				}),
				finalize(() => {
					this.creating = false;
				}),
			)
			.subscribe((response) => {
				// Something failed, along the way => abort
				if (!response.id) {
					return;
				}

				// Successfully created => navigate on detail page
				this.router.navigate(['post', response.id]);
			});
	}

	get titleControl(): FormControl {
		return this.newPostForm.get('title') as FormControl;
	}

	get contentControl(): FormControl {
		return this.newPostForm.get('content') as FormControl;
	}

	private createForm(): FormGroup {
		return this.formBuilder.group({
			title: [
				'',
				[
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(100),
				],
			],
			content: ['', [Validators.required]],
		});
	}
}
