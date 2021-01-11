import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';

const routes: Routes = [
	{
		path: 'create',
		component: CreatePostComponent,
		canActivate: [AuthGuard],
	},
	{
		path: ':id',
		component: PostDetailComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PostRoutingModule {}
