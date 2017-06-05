import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';


/**
 * Core/Shared feature modules
 */
import {CoreModule, PreloadSelectedModulesOnly} from './core';
import {SharedModule} from './shared';


/**
 * Components
 */
import {AppComponent} from './app.component';
import {ErrorComponent} from './error/error.component';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';


/**
 * Routing
 */
import {routing} from './app.routing';


@NgModule({
	imports: [
		BrowserModule,
		// Core/Shared feature modules
		SharedModule,
		CoreModule.forRoot(),
		// Routing
		routing
	],
	providers: [PreloadSelectedModulesOnly],
	declarations: [
		AppComponent,
		ErrorComponent,
		LayoutComponent,
		HomeComponent
	],
	// A list of components that can be bootstrapped.
	// Usually there is only one component in this list,
	// the root component of the application.
	bootstrap: [
		AppComponent
	]
})
export class AppModule {}
