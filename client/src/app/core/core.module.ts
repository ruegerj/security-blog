import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './guards';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '@env';
import { HttpClientModule } from '@angular/common/http';
import {
	ErrorInterceptorProvider,
	LoggingInterceptorProvider,
} from './interceptors';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		HttpClientModule,
		LoggerModule.forRoot({
			level: environment.production
				? NgxLoggerLevel.INFO
				: NgxLoggerLevel.TRACE,
			serverLogLevel: NgxLoggerLevel.OFF,
			timestampFormat: 'dd/MM/yy h:mm:ss',
		}),
	],
	providers: [LoggingInterceptorProvider, ErrorInterceptorProvider],
	exports: [],
})
export class CoreModule {
	constructor(
		@Optional()
		@SkipSelf()
		parentModule: CoreModule,
	) {
		// Guard module for multiple loads
		throwIfAlreadyLoaded(parentModule, 'CoreModule');
	}
}
