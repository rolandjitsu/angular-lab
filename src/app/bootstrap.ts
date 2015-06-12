import { bootstrap } from 'angular2/angular2';
import { routerInjectables } from 'angular2/router';

import { shadowDomInjectables } from 'common/shadow_dom'; // custom injectable that checks if ShadowDom is available to inject
import { formInjectables } from 'common/form';
import { pipeInjectables } from 'app/pipes';
import { serviceInjectables } from 'app/services';

import { App } from 'app/components';

bootstrap(App, [
	shadowDomInjectables,
	formInjectables,
	routerInjectables,
	pipeInjectables,
	serviceInjectables
]);