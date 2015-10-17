import {
	Inject,
	Component,
	View,
	ViewEncapsulation,
	CORE_DIRECTIVES
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from '../../../common/lang';
import { Todos, Todo } from '../../services';
import { TodoItem } from '../todo_item/todo_item';

@Component({
	selector: 'todo-list'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/todo_list/todo_list.html',
	styleUrls: [
		'app/components/todo_list/todo_list.css'
	],
	directives: [
		CORE_DIRECTIVES,
		TodoItem
	]
})

export class TodoList {
	todos: Todos;
	constructor(@Inject(Todos) tsp: Promise<Todos>) {
		tsp.then((ts) => this.todos = ts);
	}
}