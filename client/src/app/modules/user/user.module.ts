import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user.routing';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

@NgModule({
	declarations: [UserDashboardComponent],
	imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
