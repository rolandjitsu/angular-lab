import {provide} from 'angular2/core';
import {UrlResolver} from 'angular2/compiler';

export const isProd = true;

export const ENV_PROVIDERS: Array<any> = [
	provide(UrlResolver, {
		useClass: UrlResolver
	})
];
