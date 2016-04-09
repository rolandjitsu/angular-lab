import 'core-js/shim';
import 'zone.js';
import 'reflect-metadata';
import 'firebase';

import {bootstrap} from 'angular2/platform/browser';
import {FORM_PROVIDERS} from 'angular2/common';
import {PLATFORM_DIRECTIVES, provide, enableProdMode} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {
	ROUTER_PRIMARY_COMPONENT,
	APP_BASE_HREF,
	ROUTER_PROVIDERS as NG2_ROUTER_PROVIDERS,
	LocationStrategy,
	HashLocationStrategy
} from 'angular2/router';

import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {
	MdButton,
	MdAnchor
} from '@angular2-material/button';


import {ENV_PROVIDERS, isProd} from './env';

import {Checkbox} from './common/checkbox/checkbox';
import {Glyph} from './common/glyph/glyph';
import {SERVICES_PROVIDERS} from './services';
import {App} from './components/app/app';

const ROUTER_PROVIDERS: Array<any> = [
	NG2_ROUTER_PROVIDERS,
	provide(ROUTER_PRIMARY_COMPONENT, {
		useValue: App
	}),
	provide(LocationStrategy, {
		useClass: HashLocationStrategy
	}),
	provide(APP_BASE_HREF, {
		useValue: '/'
	})
];

if (isProd) {
	enableProdMode();
}

bootstrap(App, [
	HTTP_PROVIDERS,
	FORM_PROVIDERS,
	ROUTER_PROVIDERS,
	SERVICES_PROVIDERS,
	ENV_PROVIDERS,
	provide(PLATFORM_DIRECTIVES, {
		useValue: [
			MD_CARD_DIRECTIVES,
			MD_INPUT_DIRECTIVES,
			MdAnchor,
			MdButton,
			MdCheckbox,
			Checkbox,
			Glyph
		],
		multi: true
	})
]);
