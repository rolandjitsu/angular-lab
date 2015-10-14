import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component,
	View
} from 'angular2/angular2';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { isNativeShadowDomSupported } from 'common/lang';
import { Home } from './home/home';
import { Reset } from './reset/reset';
import { Change } from './change/change';

@Component({
	selector: 'login'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/login/login.html',
	styleUrls: [
		'app/components/login/login.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})

@RouteConfig([
	{
		component: Home,
		path: '/',
		as: 'Home'
	},
	{
		component: Reset,
		path: '/reset',
		as: 'Reset'
	},
	{
		component: Change,
		path: '/change',
		as: 'Change'
	},
])

export class Login {}