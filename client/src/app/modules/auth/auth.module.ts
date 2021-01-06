import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { LoginComponent } from './pages/login/login.component';
import { VerifySmsComponent } from './pages/verify-sms/verify-sms.component';

@NgModule({
	declarations: [LoginComponent, VerifySmsComponent],
	imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
