import { Component, View } from 'angular2/annotations';
import { NgIf } from 'angular2/directives';
import { FormBuilder, DefaultValueAccessor, NgControlName, NgForm, NgFormModel, Validators } from 'angular2/forms';

import { TodoStore } from 'app/services';
import { Autofocus, Icon } from 'app/directives';
import { TodoList } from '../todo_list/todo_list';

@Component({
	selector: 'todos'
})

@View({
	templateUrl: 'app/components/todos/todos.html',
	styleUrls: [
		'app/components/todos/todos.css'
	],
	directives: [
		NgIf,
		DefaultValueAccessor,
		NgControlName,
		NgForm,
		NgFormModel,
		Autofocus,
		Icon,
		TodoList
	]
})

export class Todos {
	form: FormBuilder;
	_store: TodoStore;
	constructor(fb: FormBuilder, store: TodoStore) {
		this.form = fb.group({
			desc: ['', Validators.required]
		});
		this._store = store;
	}
	add(value) {
		if (!value || !value.length) return;
		this._store.add(value);
		this.form.controls.desc.updateValue('');
		return false;
	}
}