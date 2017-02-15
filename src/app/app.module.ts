import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';


/**
 * Components
 */
import {AppComponent} from './app.component';
import {PreloadSelectedModulesOnly} from './core/preload-selected-modules-only';


@NgModule({
	imports: [
		BrowserModule
	],
	providers: [PreloadSelectedModulesOnly],
	declarations: [
		AppComponent
	],
	// A list of components that can be bootstrapped.
	// Usually there is only one component in this list,
	// the root component of the application.
	bootstrap: [
		AppComponent
	]
})
export class AppModule {}
