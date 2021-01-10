import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from '@app/guards';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
	{
		path: '',
		component: AuthLayoutComponent,
		canActivateChild: [NoAuthGuard],
		loadChildren: () =>
			import('@modules/auth/auth.module').then((m) => m.AuthModule),
	},
	{
		path: '',
		component: ContentLayoutComponent,
		children: [
			{
				path: 'user',
				loadChildren: () =>
					import('@modules/user/user.module').then(
						(m) => m.UserModule,
					),
			},
			{
				path: 'home',
				loadChildren: () =>
					import('@modules/home/home.module').then(
						(m) => m.HomeModule,
					),
			},
			// Fallback for unmatched routes
			{
				path: '**',
				redirectTo: '/home',
				pathMatch: 'full',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
