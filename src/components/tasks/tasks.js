import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { InjectAnnotation as Inject } from 'angular2/di';
import { NgFor } from 'angular2/directives';
import { DefaultValueAccessor, ControlDirective, ControlGroupDirective, FormBuilder, Validators } from 'angular2/forms';

import { Chores, Tests } from 'services';
import { Task } from 'components/task/task';

@Component({
	selector: 'tasks',
	appInjector: [
		FormBuilder,
		Chores,
		Tests
	]
})

@View({
	templateUrl: 'components/tasks/tasks.html',
	directives: [
		NgFor,
		DefaultValueAccessor,
		ControlDirective,
		ControlGroupDirective,
		Task
	]
})

export class Tasks {
	constructor(@Inject(FormBuilder) builder, @Inject(Chores) chores, @Inject(Tests) tests) {
		this['chore-form'] = builder.group({
			'chore': ['', Validators.required] // create custom validator https://youtu.be/4C4bmDOV5hk?t=1014
		});
		this.chore = this['chore-form'].controls.chore;
		this.chores = chores;
		this.tests = tests;
	}
	add(event, value) {
		event.preventDefault();
		if (!value || !value.length) return;
		this.chores.add(value);
		event.target.querySelector('input[name="chore"]').value = '';
		this['chore-form'].controls.chore.updateValue('');
	}
}