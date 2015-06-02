import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { InjectAnnotation as Inject } from 'angular2/di';
import { NgFor } from 'angular2/directives';
import { DefaultValueAccessor, ControlDirective, ControlGroupDirective, FormBuilder, Validators } from 'angular2/forms';

import { Tasks, Tests } from 'services'; // cleanup Tests
import { Task } from 'components/task/task';

@Component({
	selector: 'tasks',
	appInjector: [
		FormBuilder,
		Tasks,
		Tests
	]
})

@View({
	templateUrl: 'components/todos/todos.html',
	directives: [
		NgFor,
		DefaultValueAccessor,
		ControlDirective,
		ControlGroupDirective,
		Task
	]
})

export class Todos {
	constructor(@Inject(FormBuilder) builder, @Inject(Tasks) tasks, @Inject(Tests) tests) { // cleanup Tests
		this._tasks = tasks;
		this.todo = builder.group({
			'desc': ['', Validators.required]
		});
		this.desc = this.todo.controls.desc;
		this.tasks = tasks.entries;
		this.tests = tests; // cleanup Tests
	}
	add(event, value) {
		event.preventDefault();
		if (!value || !value.length) return;
		this._tasks.add(value);
		this.todo.controls.desc.updateValue('');
	}
}