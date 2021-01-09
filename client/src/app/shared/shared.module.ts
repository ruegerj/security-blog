import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuthDirective } from './directives/auth.directive';

@NgModule({
	declarations: [ValidationErrorsComponent, AlertComponent, AuthDirective],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		MDBBootstrapModule.forRoot(),
	],
	exports: [
		// Angular
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		// Libraries
		MDBBootstrapModule,
		// Shared components
		ValidationErrorsComponent,
		AlertComponent,
		// Shared directives
		AuthDirective,
	],
})
export class SharedModule {}
