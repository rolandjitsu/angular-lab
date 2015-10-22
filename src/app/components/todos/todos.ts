import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	Inject,
	Component,
	ViewEncapsulation
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES, CanActivate } from 'angular2/router';

import { AuthClient, Chores, ChoreModel } from '../../services';
import { Ng2Logo } from '../ng2_logo/ng2_logo';
import { Glyph } from '../glyph/glyph';
import { TodoItem } from '../todo_item/todo_item';

class TodosFormModel {
	desc: string;
}

@Component({
	selector: 'todos',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: 'app/components/todos/todos.html',
	styleUrls: [
		'app/components/todos/todos.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES,
		Glyph,
		Ng2Logo,
		TodoItem
	]
})

// @CanActivate()

export class Todos {
	model: TodosFormModel = new TodosFormModel();
	todos: Chores;
	private _client: AuthClient;
	constructor(@Inject(Chores) tsp: Promise<Chores>, _client: AuthClient) {
		tsp.then(ts => this.todos = ts);
		this._client = _client;
	}
	logout(event) {
		event.preventDefault();
		this._client.logout();
	}
	add() {
		this.todos.add(
			new ChoreModel(this.model.desc)
		);
		this.model.desc = '';
		return false;
	}
}