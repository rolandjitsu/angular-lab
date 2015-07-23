import { Component, View } from 'angular2/annotations';
import { Inject } from 'angular2/di';
import { NgIf } from 'angular2/directives';
import { FormBuilder, DefaultValueAccessor, NgControlName, NgForm, NgFormModel, Validators } from 'angular2/forms';
import { Instruction, OnActivate, OnDeactivate } from 'angular2/router';

import { TodoStore } from 'app/services';
import { Autofocus } from 'app/directives';
import { TodoList } from '../todo_list/todo_list';
import { Icon } from '../icon/icon';

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

export class Todos implements OnActivate, OnDeactivate {
	form: FormBuilder;
	private ts: TodoStore;
	constructor(fb: FormBuilder, @Inject(TodoStore) tsp: Promise<TodoStore>) {
		this.form = fb.group({
			desc: ['', Validators.required]
		});
		tsp.then(ts => this.ts = ts);
	}
	onActivate(next: Instruction, prev: Instruction) {}
	onDeactivate(next: Instruction, prev: Instruction) {}
	add(value) {
		if (!value || !value.length) return;
		this.ts.add(value);
		this.form.controls.desc.updateValue('');
		return false;
	}
}