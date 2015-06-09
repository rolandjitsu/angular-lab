import { Component, View, onDestroy } from 'angular2/angular2';
import { NgIf } from 'angular2/angular2';
import { DefaultValueAccessor, CheckboxControlValueAccessor, FormModelDirective, FormControlDirective, FormBuilder, ControlGroup, Control, Validators } from 'angular2/forms';
import { ObservableWrapper } from 'angular2/src/facade/async';

import { Todo } from 'app/services';

@Component({
	selector: 'task',
	properties: ['model'],
	appInjector: [
		Todo
	],
	lifecycle: [
		onDestroy
	]
})

@View({
	templateUrl: 'app/components/task/task.html',
	directives: [
		DefaultValueAccessor,
		CheckboxControlValueAccessor,
		FormModelDirective,
		FormControlDirective
	]
})

export class Task {
	task: ControlGroup;
	status: Control;
	desc: Control;
	_todo: Todo;
	_subs: Array<any>;
	_model: any;
	constructor(builder: FormBuilder, todo: Todo) {
		let that: Task = this;
		that.task = builder.group({
			status: [false],
			desc: ['', Validators.required]
		});
		that.status = that.task.controls.status;
		that.desc = that.task.controls.desc;
		that._todo = todo;
		that._subs = [
			ObservableWrapper.subscribe(that.status.valueChanges, function (value) {
				that._todo.update(that.model, {
					completed: value
				});
			}),
			ObservableWrapper.subscribe(that.desc.valueChanges, function (value) {
				if (!that.desc.valid) return;
				that._todo.update(that.model, {
					desc: value
				});
			})
		];
	}

	set model(model) {
		this._model = model;
		this.status.updateValue(model.completed);
		this.desc.updateValue(model.desc);
	}

	get model() {
		return this._model;
	}

	remove(event) {
		event.preventDefault();
		this._todo.remove(this.model.key);
	}
	blur(event) {
		event.preventDefault();
		event.target.blur();
	}

	onDestroy() {
		for (let sub of this._subs) {
			ObservableWrapper.dispose(sub);
		}
	}
}