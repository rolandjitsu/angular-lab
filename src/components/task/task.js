import { ObservableWrapper } from 'angular2/src/facade/async';
import { ComponentAnnotation as Component, ViewAnnotation as View, onDestroy } from 'angular2/angular2';
import { JitChangeDetection } from 'angular2/change_detection';
import { InjectAnnotation as Inject } from 'angular2/di';
import { NgIf } from 'angular2/directives';
import { DefaultValueAccessor, CheckboxControlValueAccessor, ControlDirective, ControlGroupDirective, FormBuilder, Validators } from 'angular2/forms';

import { Chores } from 'services';

@Component({
	selector: 'task',
	properties: {
		'chore': 'model'
	},
	// changeDetection: JitChangeDetection,
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
		this.chores = chores;
		this.task = builder.group({
			status: [false],
			desc: ['']
		});
		this.status = this.task.controls.status;
		this.desc = this.task.controls.desc;
		this._subs = [
			ObservableWrapper.subscribe(this.status.valueChanges, function (value) {
				that.chores.update(
					that.chore.key,
					Object.assign({}, that.chore, {
						completed: value
					})
				);
			}),
			ObservableWrapper.subscribe(this.desc.valueChanges, function (value) {
				that.chores.update(
					that.chore.key,
					Object.assign({}, that.chore, {
						desc: value
					})
				);
			})
		];
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