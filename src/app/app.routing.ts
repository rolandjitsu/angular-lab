import {ExtraOptions, RouterModule} from '@angular/router';

import {PreloadSelectedModulesOnly} from './core';

import {ErrorComponent} from './error/error.component';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';


const routerConfig: ExtraOptions = {
	preloadingStrategy: PreloadSelectedModulesOnly,
	useHash: true
};


// Check https://angular.io/docs/ts/latest/guide/router.html for more info about the Router and routing in general.
// For lazy loading check: http://angularjs.blogspot.ch/2016/08/angular-2-rc5-ngmodules-lazy-loading.html, https://github.com/angular/angular/pull/10705.
export const routing = RouterModule.forRoot([
	{
		path: '',
		component: LayoutComponent,
		children: [
			{path: '', component: HomeComponent},
			{path: 'finance', loadChildren: 'app/finance/finance.module#FinanceModule', data: {preload: true}}
		]
	},
	{path: '**', component: ErrorComponent}
], routerConfig);
