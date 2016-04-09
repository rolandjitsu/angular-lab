import {
	ViewEncapsulation,
	Component
} from 'angular2/core';
import {
	Route,
	Router,
	RouteConfig,
	Location,
	Instruction
} from 'angular2/router';

import {AuthClient} from '../../services';
import {Tracker} from '../../services';
import {LowerCasePipe} from '../../pipes';
import {Auth} from '../auth/auth';
import {Login} from '../login/login';
import {ResetPassword} from '../reset_password/reset_password';
import {Register} from '../register/register';
import {Account} from '../account/account';
import {Todos} from '../todos/todos';

const COMPONENT_BASE_PATH = './app/components/app';

@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/app.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/app.css`
	],
	pipes: [
		LowerCasePipe
	]
})

@RouteConfig([
	new Route({
		path: '/',
		component: Todos,
		name: 'Todos',
		useAsDefault: true
	}),
	new Route({
		path: '/account',
		component: Account,
		name: 'Account'
	}),
	new Route({
		path: '/login/...',
		component: Auth,
		name: 'Auth'
	})
])

export class App {
	constructor(router: Router, location: Location, client: AuthClient, tracker: Tracker) {
		client.session.subscribe((auth: FirebaseAuthData) => {
			router.recognize(location.path()).then((instruction: Instruction) => {
				if (auth && isAuthComponent(instruction)) {
					router.navigate(['/Todos']);
				} else if (!auth && !isAuthComponent(instruction)) {
					router.navigate(['/Auth', 'Login']);
				}
			});
		});
		router.subscribe((path) => {
			// console.log(path);
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
