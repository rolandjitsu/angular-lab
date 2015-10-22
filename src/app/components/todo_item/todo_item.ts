import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	Inject,
	Component,
	ViewEncapsulation
} from 'angular2/angular2';

import { Chores, Chore, ChoreModel } from '../../services';
import { Glyph } from '../glyph/glyph';
import { Checkbox } from '../checkbox/checkbox';

@Component({
	// moduleId: module.id, // CommonJS standard
	selector: 'todo-item',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: 'app/components/todo_item/todo_item.html',
	styleUrls: [
		'app/components/todo_item/todo_item.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		Glyph,
		Checkbox
	],
	inputs: [
		'model'
	]
})

export class TodoItem {
	isEditMode: boolean = false;
	private ts: Chores;
	private _model: Chore;

	constructor(@Inject(Chores) tsp: Promise<Chores>) {
		tsp.then(ts => this.ts = ts);
	}

	set model(model: Chore) {
		this._model = model;
	}

	get model() {
		return this._model;
	}

	remove(event) {
		event.preventDefault();
		this.ts.remove(this.model);
	}
	toggleEditMode(event, input) {
		event.preventDefault();
		this.isEditMode = !this.isEditMode;
		input.setSelectionRange(0, input.value.length);
	}

	onStatusChange(value) {
		this.ts.update(this.model, <Chore>{
			completed: value
		});
	}
	onNameChange(value) {
		this.ts.update(this.model, <Chore>{
			desc: value
		});
	}
}