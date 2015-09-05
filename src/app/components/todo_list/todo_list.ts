import { Inject, Component, View, ViewEncapsulation, NgFor } from 'angular2/angular2';

import { isNativeShadowDomSupported } from 'common/lang';
import { TodoStore, Todo } from 'app/services';
import { TodoItem } from '../todo_item/todo_item';

@Component({
	selector: 'todo-list'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED, NATIVE, NONE (default)
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
	todos: Array<Todo>;
	constructor(@Inject(TodoStore) tsp: Promise<TodoStore>) {
		tsp.then(ts => this.todos = ts.entries);
	}
}