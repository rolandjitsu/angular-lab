import { ObservableWrapper } from 'angular2/src/facade/async';
import { ComponentAnnotation as Component, ViewAnnotation as View, onDestroy } from 'angular2/angular2';
import { InjectAnnotation as Inject } from 'angular2/di';
import { NgIf } from 'angular2/directives';
import { DefaultValueAccessor, CheckboxControlValueAccessor, ControlDirective, ControlGroupDirective, FormBuilder, Validators } from 'angular2/forms';

import { Tasks } from 'services';

@Component({
	selector: 'task',
	properties: {
		'model': 'model'
	},
	appInjector: [
		FormBuilder,
		Tasks
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
	constructor(@Inject(FormBuilder) builder, @Inject(Tasks) tasks) {
		let that = this;
		that.task = builder.group({
			status: [false],
			desc: ['', Validators.required]
		});
		that.status = that.task.controls.status;
		that.desc = that.task.controls.desc;
		that._tasks = tasks;
		that._subs = [
			ObservableWrapper.subscribe(that.status.valueChanges, function (value) {
				that._tasks.update(that.model, {
					completed: value
				});
			}),
			ObservableWrapper.subscribe(that.desc.valueChanges, function (value) {
				if (!that.desc.valid) return;
				that._tasks.update(that.model, {
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
		this._tasks.remove(this.model.key);
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