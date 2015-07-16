import { bootstrap } from 'angular2/angular2';
import { formInjectables } from 'angular2/forms';
import { httpInjectables } from 'angular2/http';

import { locationInjectables } from 'common/location';
import { shadowDomInjectables } from 'common/shadow_dom'; // custom injectable that checks if ShadowDom is available to inject
import { serviceInjectables } from 'app/services';

import { App } from 'app/components';

bootstrap(App, [
	httpInjectables,
	formInjectables,
	locationInjectables,
	shadowDomInjectables,
	serviceInjectables
]);