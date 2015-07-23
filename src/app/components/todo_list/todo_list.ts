import { Component, View } from 'angular2/annotations';
import { Inject } from 'angular2/di';
import { NgFor } from 'angular2/directives';

import { TodoStore, ITodo } from 'app/services';
import { TodoItem } from '../todo_item/todo_item';

@Component({
	selector: 'todo-list'
})

@View({
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