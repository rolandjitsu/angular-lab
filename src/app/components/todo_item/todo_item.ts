import {
	Inject,
	ViewEncapsulation,
	Component,
	View,
	CORE_DIRECTIVES,
	FORM_DIRECTIVES
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from '../../../common/lang';
import { Todos, Todo, TodoModel } from '../../services';
import { Glyph } from '../../directives';
import { Checkbox } from '../checkbox/checkbox';

@Component({
	selector: 'todo-item',
	inputs: [
		'model'
	]
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/todo_item/todo_item.html',
	styleUrls: [
		'app/components/todo_item/todo_item.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		Glyph,
		Checkbox
	]
})

export class TodoItem {
	private ts: Todos;
	private _model: Todo;

	constructor(@Inject(Todos) tsp: Promise<Todos>) {
		tsp.then(ts => this.ts = ts);
	}

	set model(model: Todo) {
		this._model = TodoModel.fromModel(model);
	}

	get model() {
		return this._model;
	}

	remove(event) {
		event.preventDefault();
		this.ts.remove(this.model);
	}
	blur(event) {
		event.preventDefault();
		event.target.blur();
	}

	onStatusChange(value) {
		this.ts.update(this.model, <Todo>{
			completed: value
		});
	}
	onDescChange(value) {
		this.ts.update(this.model, <Todo>{
			desc: value
		});
	}
}