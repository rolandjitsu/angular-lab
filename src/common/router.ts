import { bind } from 'angular2/angular2';
import { ROUTER_BINDINGS as NG_ROUTER_BINDINGS, LocationStrategy, PathLocationStrategy } from 'angular2/router';

export const ROUTER_BINDINGS: Array<any> = [
	NG_ROUTER_BINDINGS,
	bind(LocationStrategy).toClass(PathLocationStrategy)
];