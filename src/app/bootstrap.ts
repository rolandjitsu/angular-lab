import { bind, bootstrap, FORM_BINDINGS } from 'angular2/angular2';
import { HTTP_BINDINGS } from 'angular2/http';
import { ROUTER_PRIMARY_COMPONENT, APP_BASE_HREF, ROUTER_BINDINGS as NG_ROUTER_BINDINGS, LocationStrategy, PathLocationStrategy } from 'angular2/router';

import { SERVICES_BINDINGS } from 'app/services';
import { App } from 'app/components';

const ROUTER_BINDINGS: Array<any> = [
	NG_ROUTER_BINDINGS,
	bind(ROUTER_PRIMARY_COMPONENT).toValue(App),
	bind(LocationStrategy).toClass(PathLocationStrategy),
	bind(APP_BASE_HREF).toValue('/')
];

const APP_BINDINGS: Array<any> = [
	HTTP_BINDINGS,
	FORM_BINDINGS,
	ROUTER_BINDINGS,
	SERVICES_BINDINGS
];

bootstrap(App, APP_BINDINGS);