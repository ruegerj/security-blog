import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredentialsRequiredGuard } from '@app/guards';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
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
				canActivate: [CredentialsRequiredGuard],
				component: SmsChallengeComponent,
			},
		],
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
