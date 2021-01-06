import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
	{
		path: '',
		component: AuthLayoutComponent,
		loadChildren: () =>
			import('@modules/auth/auth.module').then((m) => m.AuthModule),
	},
	{
		path: '',
		component: ContentLayoutComponent,
		children: [],
	},
	// Fallback for unmatched routes
	{
		path: '**',
		redirectTo: '/',
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
