import {bootstrap} from 'angular2/platform/browser';
import {FORM_PROVIDERS} from 'angular2/common';
import {provide, enableProdMode} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {
	ROUTER_PRIMARY_COMPONENT,
	APP_BASE_HREF,
	ROUTER_PROVIDERS as NG2_ROUTER_PROVIDERS,
	LocationStrategy,
	HashLocationStrategy
} from 'angular2/router';

import {SERVICES_PROVIDERS} from './services';
import {App} from './components';

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

const APP_PROVIDERS: Array<any> = [
	HTTP_PROVIDERS,
	FORM_PROVIDERS,
	ROUTER_PROVIDERS,
	SERVICES_PROVIDERS
];

// TODO: eventually this would need to be enabled only if we are in production
enableProdMode();
bootstrap(App, APP_PROVIDERS);