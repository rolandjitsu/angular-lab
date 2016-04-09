import {Inject, Component, ViewEncapsulation} from 'angular2/core';
import {CanActivate} from 'angular2/router';

import {AuthClient, isUserAuthenticated, Chores} from '../../services';
import {TodosCount} from '../todos_count/todos_count';
import {TodoList} from '../todo_list/todo_list';

const COMPONENT_BASE_PATH = './app/components/todos';

class Form {
	name: string;
}

@Component({
	selector: 'todos',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/todos.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/todos.css`
	],
	directives: [
		TodosCount,
		TodoList
	]
})

@CanActivate(() => isUserAuthenticated())

export class Todos {
	form: Form = new Form();
	private _chores: Chores;
	private _client: AuthClient;
	constructor(@Inject(Chores) csp: Promise<Chores>, _client: AuthClient) {
		csp.then((cs) => this._chores = cs);
		this._client = _client;
	}
	logout(event) {
		event.preventDefault();
		this._client.logout();
	}
	add() {
		this._chores.add(this.form.name);
		this.form.name = '';
		return false;
	}
}
