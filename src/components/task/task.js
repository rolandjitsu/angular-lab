import { ObservableWrapper } from 'angular2/src/facade/async';
import { ComponentAnnotation as Component, ViewAnnotation as View, onDestroy } from 'angular2/angular2';
import { InjectAnnotation as Inject } from 'angular2/di';
import { NgIf } from 'angular2/directives';
import { DefaultValueAccessor, CheckboxControlValueAccessor, ControlDirective, ControlGroupDirective, FormBuilder, Validators } from 'angular2/forms';

import { Chores } from 'services';

@Component({
	selector: 'task',
	properties: {
		'chore': 'model'
	},
	appInjector: [
		FormBuilder,
		Chores
	],
	lifecycle: [
		onDestroy
	]
})

@View({
	templateUrl: 'components/task/task.html',
	directives: [
		DefaultValueAccessor,
		CheckboxControlValueAccessor,
		ControlDirective,
		ControlGroupDirective
	]
})

export class Task {
	constructor(@Inject(FormBuilder) builder, @Inject(Chores) chores) {
		let that = this;
		that.chores = chores;
		that.task = builder.group({
			status: [false],
			desc: ['', Validators.required]
		});
		that.status = that.task.controls.status;
		that.desc = that.task.controls.desc;
		that._subs = [
			ObservableWrapper.subscribe(that.status.valueChanges, function (value) {
				that.chores.update(
					that.chore.key,
					Object.assign({}, that.chore, {
						completed: value
					})
				);
			}),
			ObservableWrapper.subscribe(that.desc.valueChanges, function (value) {
				if (!that.desc.valid) return;
				that.chores.update(
					that.chore.key,
					Object.assign({}, that.chore, {
						desc: value
					})
				);
			})
		];
	}

	set chore(value) {
		this._model = value;
		this.status.updateValue(value.completed);
	}

	get chore() {
		return this._model;
	}

	remove(event) {
		event.preventDefault();
		this.chores.remove(this.chore.key);
	}

	onDestroy() {
		for (let sub of this._subs) {
			ObservableWrapper.dispose(sub);
		}
	}
}