import './polyfills';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {isProd} from './env';
import {AppModule} from './app/app.module';

// Enable prod mode.
if (isProd()) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule);
