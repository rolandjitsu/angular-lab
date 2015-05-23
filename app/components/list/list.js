import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { RouterOutlet, RouterLink } from 'angular2/router';

@Component({
	selector: 'list'
})

@View({
	templateUrl: 'components/list/list.html',
	directives: [
		RouterLink
	]
})

export class List {
	constructor() {
		console.log("init list");
	}
	canActivate() {
		console.log("can activate");
	}
	activate() {
		console.log("activate");
	}
	canDeactivate() {
		console.log("can deactivate");
	}
	deactivate () {
		console.log("deactivate");
	}
}