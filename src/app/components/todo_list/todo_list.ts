import { Inject, Component, View, ViewEncapsulation, NgFor } from 'angular2/angular2';

import { TodoStore, ITodo } from 'app/services';
import { TodoItem } from '../todo_item/todo_item';

@Component({
	selector: 'todo-list'
})

@View({
	// Set `encapsulation` to `ViewEncapsulation.EMULATED` otherwise the `<todo-item>` will not be rendered for some reason
	encapsulation: ViewEncapsulation.EMULATED, // EMULATED (default), NATIVE, NONE
	templateUrl: 'app/components/todo_list/todo_list.html',
	styleUrls: [
		'app/components/todo_list/todo_list.css'
	],
	directives: [
		NgFor,
		TodoItem
	]
})

export class TodoList {
	todos: Array<ITodo>;
	constructor(@Inject(TodoStore) tsp: Promise<TodoStore>) {
		tsp.then(ts => this.todos = ts.entries);
	}
}