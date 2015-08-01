import { bootstrap, formInjectables, httpInjectables } from 'angular2/angular2';

import { locationInjectables } from 'common/location';
import { serviceInjectables } from 'app/services';

import { App } from 'app/components';

bootstrap(App, [
	httpInjectables,
	formInjectables,
	locationInjectables,
	serviceInjectables
]);