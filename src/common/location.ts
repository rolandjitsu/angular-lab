import { bind } from 'angular2/angular2';
import { routerInjectables, LocationStrategy, HashLocationStrategy } from 'angular2/router';

export const locationInjectables: Array<any> = [
	routerInjectables,
	bind(LocationStrategy).toClass(HashLocationStrategy)
];