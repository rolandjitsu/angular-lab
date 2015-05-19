import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { RouterLink } from 'angular2/router';

@Component({
	selector: 'home'
})

@View({
	templateUrl: 'components/home/home.html',
	directives: [
		RouterLink
	]
})

export class Home {
	constructor() {}
	canActivate() {
		console.log("can activate");
	}
}