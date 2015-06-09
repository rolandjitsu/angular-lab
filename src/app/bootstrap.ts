import { bootstrap } from 'angular2/angular2';
import { routerInjectables } from 'angular2/router';

import { formInjectables } from 'common/form';
import { shadowDomInjectables } from 'common/shadow_dom'; // custom injectable that checks if ShadowDom is available to inject
import { jitInjectables } from 'common/jit'; // custom injectable that uses Just-In-Time change detection
import { pipeInjectables } from 'app/pipes';
import { serviceInjectables } from 'app/services';

import { App } from 'app/components';

bootstrap(App, [
	routerInjectables,
	formInjectables,
	shadowDomInjectables,
	// jitInjectables,
	pipeInjectables,
	serviceInjectables
]);