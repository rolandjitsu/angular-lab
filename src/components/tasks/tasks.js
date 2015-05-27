import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { NgFor } from 'angular2/directives';
import { ControlGroupDirective, ControlDirective, DefaultValueAccessor, FormBuilder, Control, ControlGroup } from 'angular2/forms';

@Component({
	selector: 'tasks',
	appInjector: [
		FormBuilder
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
	tasks: array;
	form: ControlGroup;
	input: Control;
	constructor(builder: FormBuilder) {
		this.tasks = [{
			value: "completed",
			timestamp: new Date()
		}];
		this.form = builder.group({
			'task': ['']
		});
		this.input = this.form.controls.task;
	}
	add(event, value) {
		event.preventDefault();
		this.tasks.push({
			value: value,
			timestamp: new Date()
		});
		this._setDefaultInput(event.target, 'task');
	}
	remove(event, index) {
		event.preventDefault();
		this.tasks.splice(index, 1);
	}
	_setDefaultInput(el, name) {
	// update stateful element and internal model to default values
		el.querySelector(`input[name=${name}]`).value = '';
		this.form.controls[name].updateValue('');
	}
}