import './polyfills';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {isProd, isStaging} from './env';
import {AppModule} from './app/app.module';

// Enable prod mode.
if (isProd() || isStaging()) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule);
