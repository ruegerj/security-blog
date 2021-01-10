import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards';
import { CreatePostComponent } from './pages/create-post/create-post.component';

const routes: Routes = [
	{
		path: 'create',
		component: CreatePostComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PostRoutingModule {}
