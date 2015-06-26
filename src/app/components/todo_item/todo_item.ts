import { Component, View, Parent, onDestroy } from 'angular2/annotations';
import { NgIf } from 'angular2/directives';
import { FormBuilder, Control, ControlGroup, DefaultValueAccessor, NgControlName, NgForm, NgFormModel, Validators } from 'angular2/forms';
import { ObservableWrapper } from 'angular2/src/facade/async';

import { TodoStore, ITodo } from 'app/services';
import { Checkbox } from '../checkbox/checkbox';
import { Icon } from '../icon/icon';

@Component({
	selector: 'todo-item',
	properties: [
		'model'
	],
	lifecycle: [
		onDestroy
	]
})

@View({
	templateUrl: 'app/components/todo_item/todo_item.html',
	styleUrls: [
		'app/components/todo_item/todo_item.css'
	],
	directives: [
		DefaultValueAccessor,
		NgControlName,
		NgForm,
		NgFormModel,
		Icon,
		Checkbox
	]
})

export class TodoItem {
	form: ControlGroup;
	status: Control;
	desc: Control;
	_store: TodoStore;
	_subs: Array<any>;
	_model: ITodo;
	constructor(fb: FormBuilder, @Parent() store: TodoStore) {
		let that: TodoItem = this;
		that.form = fb.group({
			status: [false],
			desc: ['', Validators.required]
		});
		that.status = that.form.controls.status;
		that.desc = that.form.controls.desc;
		that._store = store;
		that._subs = [
			ObservableWrapper.subscribe(that.status.valueChanges, function (value) {
				if (that.model.completed === value) return;
				that._store.update(that.model, {
					completed: value
				});
			}),
			ObservableWrapper.subscribe(that.desc.valueChanges, function (value) {
				if (that.desc.pristine || !that.desc.valid || that.model.desc === value) return;
				that._store.update(that.model, {
					desc: value
				});
			})
		];
	}

	set model(model: ITodo) {
		this._model = model;
		this.status.updateValue(model.completed);
		this.desc.updateValue(model.desc);
	}

	get model() {
		return this._model;
	}

	remove(event) {
		event.preventDefault();
		this._store.remove(this.model);
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