import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MapboxService} from './map.service';
import {PoolingService} from './pooling.service';
import {ViewTitleComponent} from './view-title/view-title.component';


const ANGULAR_SHARED_MODULES = [
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	RouterModule,
	FlexLayoutModule,
	HttpModule
];


const SHARED_MODULES = [];
const SHARED_COMPONENTS = [
	ViewTitleComponent
];
// Use this for Material dialogs.
const SHARED_ENTRY_COMPONENTS = [];
const SHARED_DIRECTIVES = [];
const SHARED_PIPES = [];
const SHARED_PROVIDERS = [
	MapboxService,
	PoolingService
];


// NOTE: Do not specify providers for modules that might be imported by a lazy loaded module,
// especially when the provider needs to be a singleton, use `forRoot()` instead.
@NgModule({
	// A list of supporting modules.
	// Specifically, the list of modules whose exported components,
	// directives or pipes are referenced by the component templates declared in this module.
	imports: [
		// Angular
		...ANGULAR_SHARED_MODULES,
		// Material
		MaterialModule.forRoot(),
		// App
		...SHARED_MODULES
	],
	// Components/Directives/Pipes
	// Declared classes are visible within the module but invisible to components in a different module unless (a) they are exported from this module and (b) that other module imports this one.
	declarations: [
		...SHARED_DIRECTIVES,
		...SHARED_COMPONENTS,
		...SHARED_ENTRY_COMPONENTS,
		...SHARED_PIPES
	],
	// A list of DI providers that an importing module can use.
	providers: [
		...SHARED_PROVIDERS
	],
	// A list of declarations (component, directive,
	// and pipe classes) that an importing module can use.
	exports: [
		// Angular
		...ANGULAR_SHARED_MODULES,
		// Material
		MaterialModule,
		// App
		...SHARED_MODULES,
		...SHARED_DIRECTIVES,
		...SHARED_COMPONENTS,
		...SHARED_PIPES
	],
	entryComponents: [
		...SHARED_ENTRY_COMPONENTS
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: []
		};
	}
}
