import {
	Component,
	Inject,
	ViewEncapsulation
} from 'angular2/core';

import {Chores} from '../../services';
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
		TodoList
	]
})

export class Todos {
	form: Form = new Form();
	private _chores: Chores;

	constructor(@Inject(Chores) csp: Promise<Chores>) {
		csp.then((cs) => this._chores = cs);
	}

	add() {
		this._chores.add(this.form.name);
		this.form.name = '';
		return false;
	}
}
