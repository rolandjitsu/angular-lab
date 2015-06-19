import { Component, View } from 'angular2/annotations';
import { NgFor } from 'angular2/angular2';

import { TodoStore, ITodo } from 'app/services';
import { TodoItem } from '../todo_item/todo_item';

@Component({
	selector: 'todo-list'
})

@View({
	templateUrl: 'app/components/todo_list/todo_list.html',
	styles: [
		'@import "todo_list.css";'
	],
	directives: [
		NgFor,
		TodoItem
	]
})

export class TodoList {
	todos: Array<ITodo>;
	constructor(store: TodoStore) {
		this.todos = store.entries;
	}
}