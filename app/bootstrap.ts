import 'core-js/shim';
import 'zone.js';
import 'reflect-metadata';
import 'firebase';

import {bootstrap} from 'angular2/platform/browser';
import {FORM_PROVIDERS, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {PLATFORM_DIRECTIVES, provide, enableProdMode} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {
	ROUTER_PRIMARY_COMPONENT,
	APP_BASE_HREF,
	ROUTER_PROVIDERS,
	ROUTER_DIRECTIVES,
	LocationStrategy,
	HashLocationStrategy
} from 'angular2/router';

import {MdAnchor, MdButton} from '@angular2-material/button';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MdToolbar} from '@angular2-material//toolbar';

import {ENV_PROVIDERS, isProd} from './env';

import {Checkbox} from './common/checkbox/checkbox';
import {Glyph} from './common/glyph/glyph';
import {SERVICES_PROVIDERS} from './services';
import {App} from './components/app/app';

if (isProd) {
	enableProdMode();
}

bootstrap(App, [
	HTTP_PROVIDERS,
	FORM_PROVIDERS,
	ROUTER_PROVIDERS,
	provide(ROUTER_PRIMARY_COMPONENT, {
		useValue: App
	}),
	provide(LocationStrategy, {
		useClass: HashLocationStrategy
	}),
	provide(APP_BASE_HREF, {
		useValue: '/'
	}),
	ENV_PROVIDERS,
	SERVICES_PROVIDERS,
	provide(PLATFORM_DIRECTIVES, {
		useValue: [
			CORE_DIRECTIVES,
			FORM_DIRECTIVES,
			ROUTER_DIRECTIVES,
			MD_CARD_DIRECTIVES,
			MD_INPUT_DIRECTIVES,
			MdAnchor,
			MdButton,
			MdCheckbox,
			MdToolbar,
			Checkbox,
			Glyph
		],
		multi: true
	})
]);
