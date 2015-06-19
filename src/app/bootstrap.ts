import { bootstrap } from 'angular2/angular2';
import { formInjectables } from 'angular2/forms';
import { httpInjectables } from 'angular2/http';
import { routerInjectables } from 'angular2/router';

import { shadowDomInjectables } from 'common/shadow_dom'; // custom injectable that checks if ShadowDom is available to inject
import { pipeInjectables } from 'app/pipes';
import { serviceInjectables } from 'app/services';

import { App } from 'app/components';

bootstrap(App, [
	httpInjectables,
	formInjectables,
	routerInjectables,
	shadowDomInjectables,
	pipeInjectables,
	serviceInjectables
]);