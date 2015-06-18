import { bootstrap } from 'angular2/angular2';
import { formInjectables } from 'angular2/forms';
import { routerInjectables } from 'angular2/router';

import { shadowDomInjectables } from 'common/shadow_dom'; // custom injectable that checks if ShadowDom is available to inject
import { pipeInjectables } from 'app/pipes';
import { serviceInjectables } from 'app/services';

import { App } from 'app/components';

bootstrap(App, [
	shadowDomInjectables, // TODO: refactor html and css as fallback for when shadow dom is not available (because use of :host and shdow dom specific css selectors)
	formInjectables,
	routerInjectables,
	pipeInjectables,
	serviceInjectables
]);