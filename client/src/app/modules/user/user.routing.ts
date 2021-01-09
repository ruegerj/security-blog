import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards';
import { Role } from '@data/enums';

const routes: Routes = [
	{
		path: 'dashboard',
		canActivate: [AuthGuard],
		data: {
			roles: [Role.User],
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserRoutingModule {}
