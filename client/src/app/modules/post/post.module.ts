import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PostSummaryComponent } from './components/post-summary/post-summary.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { PostRoutingModule } from './post.routing';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
	declarations: [PostSummaryComponent, CreatePostComponent],
	imports: [CommonModule, CKEditorModule, PostRoutingModule, SharedModule],
	exports: [
		// Shared components
		PostSummaryComponent,
	],
})
export class PostModule {}
