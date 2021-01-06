import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';

@NgModule({
	declarations: [ValidationErrorsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		MDBBootstrapModule.forRoot(),
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		MDBBootstrapModule,
		ValidationErrorsComponent,
	],
})
export class SharedModule {}
