import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin.routing';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PostModule } from '@modules/post/post.module';

@NgModule({
	declarations: [AdminDashboardComponent],
	imports: [CommonModule, AdminRoutingModule, PostModule, SharedModule],
})
export class AdminModule {}
