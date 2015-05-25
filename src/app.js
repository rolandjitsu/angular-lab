import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { Home } from 'components/home/home';

@Component({
	selector: 'app'
})

@View({
	template: `<home></home>`,
	directives: [
		Home
	]
})

export class App {
	constructor() {}
}