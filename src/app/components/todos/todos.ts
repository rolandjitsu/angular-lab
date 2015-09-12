import {
	Inject,
	ViewEncapsulation,
	Component,
	View,
	NgIf,
	NgControlName,
	NgModel,
	NgForm,
	DefaultValueAccessor,
	NgRequiredValidator
} from 'angular2/angular2';
import { ComponentInstruction, OnActivate, OnDeactivate } from 'angular2/router';

import { isNativeShadowDomSupported } from 'common/lang';
import { TodoStore, TodoModel } from 'app/services';
import { TodoList } from '../todo_list/todo_list';
import { Icon } from '../icon/icon';

class TodosFormModel {
	desc: string;
}

@Component({
	selector: 'todos'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/todos/todos.html',
	styleUrls: [
		'app/components/todos/todos.css'
	],
	directives: [
		NgIf,
		NgControlName,
		NgModel,
		NgForm,
		DefaultValueAccessor,
		NgRequiredValidator,
		Icon,
		TodoList
	]
})

export class Todos implements OnActivate, OnDeactivate {
	model: TodosFormModel = new TodosFormModel();
	private ts: TodoStore;
	constructor(@Inject(TodoStore) tsp: Promise<TodoStore>) {
		tsp.then(ts => this.ts = ts);
	}
	onActivate(next: ComponentInstruction, prev: ComponentInstruction) {}
	onDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {}
	add() {
		this.ts.add(
			new TodoModel(this.model.desc)
		);
		this.model.desc = '';
		return false;
	}
}