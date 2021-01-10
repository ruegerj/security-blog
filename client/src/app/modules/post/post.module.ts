import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PostSummaryComponent } from './components/post-summary/post-summary.component';

@NgModule({
	declarations: [PostSummaryComponent],
	imports: [CommonModule, SharedModule],
	exports: [
		// Shared components
		PostSummaryComponent,
	],
})
export class PostModule {}
