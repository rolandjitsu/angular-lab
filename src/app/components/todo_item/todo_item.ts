import {
	Inject,
	ViewEncapsulation,
	Component,
	View,
	CORE_DIRECTIVES,
	FORM_DIRECTIVES
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from 'common/lang';
import { TodoStore, Todo, TodoModel } from 'app/services';
import { Checkbox } from '../checkbox/checkbox';
import { Icon } from '../icon/icon';

@Component({
	selector: 'todo-item',
	inputs: [
		'model'
	]
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/todo_item/todo_item.html',
	styleUrls: [
		'app/components/todo_item/todo_item.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		Icon,
		Checkbox
	]
})

export class TodoItem {
	private ts: TodoStore;
	private _model: Todo;

	constructor(@Inject(TodoStore) tsp: Promise<TodoStore>) {
		tsp.then(ts => this.ts = ts);
	}

	set model(model: Todo) {
		this._model = TodoModel.fromModel(model);
	}

	get model() {
		return this._model;
	}

	remove(event) {
		event.preventDefault();
		this.ts.remove(this.model);
	}
	blur(event) {
		event.preventDefault();
		event.target.blur();
	}

	onStatusChange() {
		this.ts.update(this.model, <Todo>{
			completed: !this.model.completed
		});
	}
	onDescChange() {
		this.ts.update(this.model, <Todo>{
			desc: this.model.desc
		});
	}
}