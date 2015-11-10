import {
	CORE_DIRECTIVES,
	ViewEncapsulation,
	Component
} from 'angular2/angular2';

import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';

import { Login } from '../login/login';
import { ResetPassword } from '../reset_password/reset_password';
import { Register } from '../register/register';

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
		component: Login,
		path: '/',
		as: 'Login'
	},
	{
		component: ResetPassword,
		path: '/reset',
		as: 'Reset'
	},
	{
		component: Register,
		path: '/register',
		as: 'Register'
	}
])

export class Auth {}