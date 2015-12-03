import {ViewEncapsulation, Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {Login} from '../login/login';
import {ResetPassword} from '../reset_password/reset_password';
import {Register} from '../register/register';

@Component({
	selector: 'auth',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: 'app/components/auth/auth.html',
	styleUrls: [
		'app/components/auth/auth.css'
	],
	directives: [
		CORE_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})

@RouteConfig([
	{
		path: '/',
		component: Login,
		useAsDefault: true,
		as: 'Login'
	},
	{
		path: '/reset',
		component: ResetPassword,
		as: 'Reset'
	},
	{
		path: '/register',
		component: Register,
		as: 'Register'
	}
])

export class Auth {}