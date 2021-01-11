import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PostSummaryComponent } from './components/post-summary/post-summary.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { PostRoutingModule } from './post.routing';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { PostStateColorPipe } from './pipes/post-state-color.pipe';
import { PostStateTextPipe } from './pipes/post-state-text.pipe';

@NgModule({
	declarations: [PostSummaryComponent, CreatePostComponent, PostDetailComponent, PostStateColorPipe, PostStateTextPipe],
	imports: [CommonModule, CKEditorModule, PostRoutingModule, SharedModule],
	exports: [
		// Shared components
		PostSummaryComponent,
	],
})
export class PostModule {}
