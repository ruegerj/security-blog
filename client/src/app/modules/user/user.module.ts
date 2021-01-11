import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user.routing';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { PostModule } from '@modules/post/post.module';

@NgModule({
	declarations: [UserDashboardComponent],
	imports: [CommonModule, UserRoutingModule, PostModule, SharedModule],
})
export class UserModule {}
