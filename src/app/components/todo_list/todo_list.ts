import { Inject, Component, View, ViewEncapsulation, NgFor } from 'angular2/angular2';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { TodoStore, ITodo } from 'app/services';
import { TodoItem } from '../todo_item/todo_item';

@Component({
	selector: 'todo-list'
})

@View({
	encapsulation: isNativeShadowDOMSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED (default), NATIVE, NONE
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