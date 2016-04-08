import {ViewEncapsulation, Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteConfig, Route} from 'angular2/router';

import {Login} from '../login/login';
import {ResetPassword} from '../reset_password/reset_password';
import {Register} from '../register/register';

const COMPONENT_BASE_PATH = './app/components/auth';

@Component({
	selector: 'auth',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/auth.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/auth.css`
	],
	directives: [
		CORE_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})

@RouteConfig([
	new Route({
		path: '/',
		component: Login,
		name: 'Login',
		useAsDefault: true
	}),
	new Route({
		path: '/reset',
		component: ResetPassword,
		name: 'Reset'
	}),
	new Route({
		path: '/register',
		component: Register,
		name: 'Register'
	})
])

export class Auth {}
