import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { InjectAnnotation as Inject } from 'angular2/di';
import { NgFor } from 'angular2/directives';
import { DefaultValueAccessor, ControlDirective, ControlGroupDirective, FormBuilder, Validators } from 'angular2/forms';

import { Chores } from 'services';
import { Task } from 'components/task/task';

@Component({
	selector: 'tasks',
	appInjector: [
		FormBuilder,
		Chores
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
	constructor(@Inject(FormBuilder) builder, @Inject(Chores) chores) {
		this['chore-form'] = builder.group({
			'chore': ['', Validators.required]
		});
		this.chore = this['chore-form'].controls.chore;
		this.chores = chores;
	}
	add(event, value) {
		event.preventDefault();
		if (!value || !value.length) return;
		this.chores.add(value);
		event.target.querySelector('input[name="chore"]').value = '';
		this['chore-form'].controls.chore.updateValue('');
	}
}