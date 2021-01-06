import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { LoginComponent } from './pages/login/login.component';
import { SmsChallengeComponent } from './pages/sms-challenge/sms-challenge.component';

@NgModule({
	declarations: [LoginComponent, SmsChallengeComponent],
	imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
