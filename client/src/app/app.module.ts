import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavComponent } from './layout/nav/nav.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

@NgModule({
	declarations: [AppComponent, ContentLayoutComponent, NavComponent, AuthLayoutComponent],
	imports: [BrowserModule, CoreModule, SharedModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
