import 'core-js/shim';
import 'reflect-metadata';
import 'zone.js';

import {
	APP_BASE_HREF,
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	FORM_PROVIDERS,
	LocationStrategy,
	HashLocationStrategy
} from '@angular/common';
import {
	PLATFORM_DIRECTIVES,
	enableProdMode
} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ENV_PROVIDERS, isProd} from './env';

import {App} from './components/app/app';

if (isProd) {
	enableProdMode();
}

bootstrap(App, [
	FORM_PROVIDERS,
	HTTP_PROVIDERS,
	ENV_PROVIDERS,
	{
		provide: APP_BASE_HREF,
		useValue: '/'
	},
	{
		provide: LocationStrategy,
		useClass: HashLocationStrategy
	},
	{
		provide: PLATFORM_DIRECTIVES,
		useValue: [
			CORE_DIRECTIVES,
			FORM_DIRECTIVES,
			ROUTER_DIRECTIVES
		],
		multi: true
	}
]);
