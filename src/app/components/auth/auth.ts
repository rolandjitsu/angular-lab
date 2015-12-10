import {ViewEncapsulation, Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {Login} from '../login/login';
import {ResetPassword} from '../reset_password/reset_password';
import {Register} from '../register/register';

@Component({
	moduleId: module.id, // CommonJS standard
	selector: 'auth',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: './auth.html',
	styleUrls: [
		'./auth.css'
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