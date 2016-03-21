import 'es6-shim';
import 'zone.js';
import 'reflect-metadata';

import {setBaseTestProviders} from 'angular2/testing';
import {TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS} from 'angular2/platform/testing/browser';
import {UrlResolver} from 'angular2/compiler';
import {provide} from 'angular2/core';


setBaseTestProviders(
	TEST_BROWSER_PLATFORM_PROVIDERS,
	TEST_BROWSER_APPLICATION_PROVIDERS.concat([
		provide(UrlResolver, {useFactory: () => new FakeUrlResolver()})
	])
);


class FakeUrlResolver extends UrlResolver {
	constructor() {
		super();
	}
	resolve(baseUrl: string, url: string): string {
		// We do not attempt to load any CSS,
		// as it is irrelevant during unit tests.
		if (url.substr(-4) === '.css') {
			return '';
		}
		return super.resolve(baseUrl, url);
	}
}
