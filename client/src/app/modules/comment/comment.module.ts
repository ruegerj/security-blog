import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';
import { CommentComponent } from './components/comment/comment.component';

@NgModule({
	declarations: [CommentSectionComponent, CommentComponent],
	imports: [CommonModule, SharedModule],
	exports: [CommentSectionComponent],
})
export class CommentModule {}
