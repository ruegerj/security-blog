import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from '@app/guards';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
	{
		path: 'user',
		component: ContentLayoutComponent,
		loadChildren: () =>
			import('@modules/user/user.module').then((m) => m.UserModule),
	},
	{
		path: 'admin',
		component: ContentLayoutComponent,
		loadChildren: () =>
			import('@modules/admin/admin.module').then((m) => m.AdminModule),
	},
	{
		path: 'home',
		component: ContentLayoutComponent,
		loadChildren: () =>
			import('@modules/home/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'post',
		component: ContentLayoutComponent,
		loadChildren: () =>
			import('@modules/post/post.module').then((m) => m.PostModule),
	},
	{
		path: '',
		component: AuthLayoutComponent,
		canActivateChild: [NoAuthGuard],
		loadChildren: () =>
			import('@modules/auth/auth.module').then((m) => m.AuthModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
