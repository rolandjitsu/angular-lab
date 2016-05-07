import 'core-js/shim';
import 'reflect-metadata';
import 'zone.js';
import 'firebase';

import {
	APP_BASE_HREF,
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	FORM_PROVIDERS
} from '@angular/common';
import {
	PLATFORM_DIRECTIVES,
	provide,
	enableProdMode,
	Type
} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {bootstrap} from '@angular/platform-browser-dynamic';

import {ENV_PROVIDERS, isProd} from './env';

import {App} from './components/app/app';

if (isProd) {
	enableProdMode();
}

bootstrap(<Type>App, [
	HTTP_PROVIDERS,
	FORM_PROVIDERS,
	provide(APP_BASE_HREF, {
		useValue: '/'
	}),
	ENV_PROVIDERS,
	provide(PLATFORM_DIRECTIVES, {
		useValue: [
			CORE_DIRECTIVES,
			FORM_DIRECTIVES
		],
		multi: true
	})
]);
