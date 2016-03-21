import {provide} from 'angular2/core';
import {UrlResolver} from 'angular2/compiler';

export const isProd = false;

export class ScssUrlResolver extends UrlResolver {
	constructor() {
		// No prefix
		super();
	}

	resolve(baseUrl: string, url: string): string {
		// During dev mode, when we ask for a `.css` file,
		// we actually need to ask for a `.scss` file that will be transpiled at runtime.
		if (url.substr(-4) === '.css') {
			const idx = url.lastIndexOf('.css');
			url = `${url.substr(0, idx)}.scss`;
		}

		return super.resolve(baseUrl, url);
	}
}


export const ENV_PROVIDERS: Array<any> = [
	provide(UrlResolver, {
		useClass: ScssUrlResolver
	})
];
