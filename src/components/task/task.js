import { ObservableWrapper } from 'angular2/src/facade/async';
import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
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
	changeDetection: JitChangeDetection,
	appInjector: [
		FormBuilder,
		Chores
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
		this.chores = chores;
	}
	remove(event) {
		event.preventDefault();
		this.chores.remove(this.chore);
	}
}