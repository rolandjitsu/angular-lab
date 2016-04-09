import {
	Component,
	ViewEncapsulation
} from 'angular2/core';
import {
	Route,
	RouteConfig,
	CanActivate
} from 'angular2/router';

import {AuthClient, isUserAuthenticated} from '../../services';
import {TodosCount} from '../todos_count/todos_count';
import {Account} from "../account/account";
import {Todos} from "../todos/todos";

const COMPONENT_BASE_PATH = './app/components/dashboard';

class Form {
	name: string;
}

@Component({
	selector: 'dashboard',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/dashboard.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/dashboard.css`
	],
	directives: [
		TodosCount
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
	})
])

@CanActivate(() => isUserAuthenticated())

export class Dashboard {
	form: Form = new Form();
	private _client: AuthClient;

	constructor(_client: AuthClient) {
		this._client = _client;
	}

	logout(event) {
		event.preventDefault();
		this._client.logout();
	}
}
