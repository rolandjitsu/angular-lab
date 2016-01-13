import {ViewEncapsulation, Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router, RouteConfig, Location, Instruction} from 'angular2/router';

import {AuthClient} from '../../services';
import {Tracker} from '../../services';
import {LowerCasePipe} from '../../pipes';
import {Auth} from '../auth/auth';
import {Login} from '../login/login';
import {ResetPassword} from '../reset_password/reset_password';
import {Register} from '../register/register';
import {Account} from '../account/account';
import {Todos} from '../todos/todos';

@Component({
	moduleId: module.id, // CommonJS standard
	selector: 'app',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: './app.html',
	styleUrls: [
		'./app.css'
	],
	directives: [
		CORE_DIRECTIVES,
		ROUTER_DIRECTIVES
	],
	pipes: [
		LowerCasePipe
	]
})

@RouteConfig([
	{
		path: '/',
		component: Todos,
		useAsDefault: true,
		as: 'Todos'
	},
	{
		path: '/account',
		component: Account,
		as: 'Account'
	},
	{
		path: '/login/...',
		component: Auth,
		as: 'Auth'
	}
])

export class App {
	constructor(router: Router, location: Location, client: AuthClient, tracker: Tracker) {
		client.session.subscribe((auth: FirebaseAuthData) => {
			router.recognize(location.path()).then((instruction: Instruction) => {
				if (auth && isAuthComponent(instruction)) router.navigate(['/Todos']);
				else if (!auth && !isAuthComponent(instruction)) router.navigate(['/Auth', 'Login']);
			});
		});
		router.subscribe((path) => {
			console.log(path);
			tracker.send('pageview', path.length ? path : '/');
			// router.recognize(path).then((instruction: Instruction) => {
			// 	console.log(instruction);
			// 	
			// 	// if (!client.session && !isAuthComponent(instruction)) router.navigate(['/Auth', 'Login']);
			// });
		});
	}
}

function isAuthComponent(instruction: Instruction): boolean {
	if (!instruction) return false;
	let component = instruction.component.componentType;
	return component === Auth
		|| component === Login
		|| component === ResetPassword
		|| component === Register;
}