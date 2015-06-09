import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { NgFor, NgIf } from 'angular2/directives';
import { DefaultValueAccessor, FormModelDirective, FormControlDirective, FormBuilder, ControlGroup, Control, Validators } from 'angular2/forms';

import { Todo } from 'app/services';
import { Task } from 'app/components';

@Component({
	selector: 'todos',
	appInjector: [
		Todo
	]
})

@View({
	templateUrl: 'app/components/todos/todos.html',
	directives: [
		NgFor,
		NgIf,
		DefaultValueAccessor,
		FormModelDirective,
		FormControlDirective,
		Task
	]
})

export class Todos {
	todos: Array<any>;
	todo: ControlGroup;
	desc: Control;
	_todo: Todo;
	constructor(builder: FormBuilder, todo: Todo) {
		this._todo = todo;
		this.todos = todo.entries;
		this.todo = builder.group({
			'desc': ['', Validators.required]
		});
		this.desc = this.todo.controls.desc;
	}
	add(event, value) {
		event.preventDefault();
		if (!value || !value.length) return;
		this._todo.add(value);
		this.desc.updateValue('');
	}
}