import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from './home.routing';
import { HomeComponent } from './pages/home/home.component';
import { PostModule } from '@modules/post/post.module';

@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, HomeRoutingModule, PostModule, SharedModule],
})
export class HomeModule {}
