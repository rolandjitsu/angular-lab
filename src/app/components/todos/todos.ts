import { Component, View } from 'angular2/angular2';
import { NgFor, NgIf } from 'angular2/angular2';
import { DefaultValueAccessor, FormModelDirective, ControlNameDirective, FormBuilder, ControlGroup, Control, Validators } from 'angular2/forms';

import { Todo } from 'app/services';
import { Task } from '../task/task';

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
		ControlNameDirective,
		Task
	]
})

export class Todos {
	todos: Array<any>;
	form: FormBuilder;
	_todo: Todo;
	constructor(fb: FormBuilder, todo: Todo) {
		this._todo = todo;
		this.todos = todo.entries;
		this.form = fb.group({
			desc: ['', Validators.required]
		}); 
	}
	add(value) {
		if (!value || !value.length) return;
		this._todo.add(value);
		this.form.controls.desc.updateValue('');
		return false;
	}
}