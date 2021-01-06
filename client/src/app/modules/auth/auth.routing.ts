import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SmsChallengeComponent } from './pages/sms-challenge/sms-challenge.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'challenge',
		children: [
			{
				path: 'sms',
				component: SmsChallengeComponent,
			},
		],
	},
	{
		path: 'register',
		children: [],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
