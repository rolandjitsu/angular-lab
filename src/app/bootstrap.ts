import { bootstrap, FORM_BINDINGS } from 'angular2/angular2';
import { HTTP_BINDINGS } from 'angular2/http';

import { ROUTER_BINDINGS } from 'common/router';

import { SERVICES_BINDINGS } from 'app/services';
import { App } from 'app/components';

bootstrap(App, [
	HTTP_BINDINGS,
	FORM_BINDINGS,
	ROUTER_BINDINGS,
	SERVICES_BINDINGS
]);