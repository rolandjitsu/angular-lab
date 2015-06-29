import { bind } from 'angular2/angular2';
import { routerInjectables, LocationStrategy, HashLocationStrategy } from 'angular2/router';

export var locationInjectables: Array<any> = [
	routerInjectables,
	bind(LocationStrategy).toClass(HashLocationStrategy)
];