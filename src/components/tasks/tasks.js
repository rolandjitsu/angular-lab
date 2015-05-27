import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { NgFor } from 'angular2/directives';
import { DefaultValueAccessor, ControlDirective, ControlGroupDirective, FormBuilder, Control, ControlGroup, Validators } from 'angular2/forms';

import { TasksService } from 'services/tasks';

@Component({
	selector: 'tasks',
	appInjector: [
		FormBuilder,
		TasksService
	]
})

@View({
	templateUrl: 'components/tasks/tasks.html',
	directives: [
		NgFor,
		ControlGroupDirective,
		ControlDirective,
		DefaultValueAccessor
	]
})

export class Tasks {
	form: ControlGroup;
	input: Control;
	constructor(builder: FormBuilder, tasks: TasksService) {
		this.form = builder.group({
			'task': ['', Validators.required]
		});
		this.input = this.form.controls.task;
		this.tasks = tasks;
	}
	add(event, value) {
		event.preventDefault();
		if (!value || !value.length) return;
		this.tasks.add(value);
		event.target.querySelector('input[name="task"]').value = '';
		this.form.controls.task.updateValue('');
	}
	remove(event, index) {
		event.preventDefault();
		this.tasks.remove(index);
	}
}