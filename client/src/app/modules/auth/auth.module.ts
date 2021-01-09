import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { LoginComponent } from './pages/login/login.component';
import { SmsChallengeComponent } from './pages/sms-challenge/sms-challenge.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
	declarations: [LoginComponent, SmsChallengeComponent, RegisterComponent],
	imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
