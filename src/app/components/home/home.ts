import {
	Inject,
	ViewEncapsulation,
	Component,
	View,
	CORE_DIRECTIVES,
	FORM_DIRECTIVES
} from 'angular2/angular2';
import { ComponentInstruction, OnActivate, OnDeactivate, CanActivate } from 'angular2/router';

// import { isUserAuthenticated } from '../../../common/authentication';
import { isNativeShadowDomSupported } from '../../../common/lang';
import { Todos, TodoModel } from '../../services';
import { Glyph } from '../../directives';
import { TodoList } from '../todo_list/todo_list';

class TodosFormModel {
	desc: string;
}

@Component({
	selector: 'home'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/home/home.html',
	styleUrls: [
		'app/components/home/home.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		Glyph,
		TodoList
	]
})

// @CanActivate(isUserAuthenticated)

export class Home implements OnActivate, OnDeactivate {
	model: TodosFormModel = new TodosFormModel();
	private ts: Todos;
	constructor(@Inject(Todos) tsp: Promise<Todos>) {
		tsp.then(ts => this.ts = ts);
	}
	onActivate(next: ComponentInstruction, prev: ComponentInstruction) {
		// Here we can do something when the component gets activated
	}
	onDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
		// Here we can do something when the component gets deactivated
	}
	add() {
		this.ts.add(
			new TodoModel(this.model.desc)
		);
		this.model.desc = '';
		return false;
	}
}