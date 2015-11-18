import {
	CORE_DIRECTIVES,
	ViewEncapsulation,
	Component
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES, Router, RouteConfig, Location, Instruction } from 'angular2/router';

import { AuthClient } from '../../services';
import { LowerCasePipe } from '../../pipes';
import { Auth } from '../auth/auth';
import { Login } from '../login/login';
import { ResetPassword } from '../reset_password/reset_password';
import { Register } from '../register/register';
import { Account } from '../account/account';
import { Todos } from '../todos/todos';

@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: 'app/components/app/app.html',
	styleUrls: [
		'app/components/app/app.css'
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
		component: Todos,
		path: '/',
		as: 'Todos'
	},
	{
		component: Account,
		path: '/account',
		as: 'Account'
	},
	{
		component: Auth,
		path: '/login/...',
		as: 'Auth'
	}
])

export class App {
	constructor(router: Router, location: Location, client: AuthClient) {
		client.session.subscribe((auth: FirebaseAuthData) => {
			router.recognize(location.path()).then((instruction: Instruction) => {
				if (auth && isAuthComponent(instruction)) router.navigate(['/Todos']);
				else if (!auth && !isAuthComponent(instruction)) router.navigate(['/Auth', 'Login']);
			});
		});
		// TODO: eventually this will be handled by `@CanActivate` hook
		// router.subscribe((path) => {
		// 	router.recognize(path).then((instruction: Instruction) => {
		// 		if (!client.session && !isAuthComponent(instruction)) router.navigate(['/Auth', 'Login']);
		// 	});
		// });
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