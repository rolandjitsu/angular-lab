import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { RouteConfigAnnotation as RouteConfig, RouterOutlet, RouterLink, Router } from 'angular2/router';
import { Home } from 'components/home/home';

@Component({
	selector: 'app'
})

@View({
	template: `<router-outlet></router-outlet>`,
	directives: [
		RouterOutlet,
		RouterLink
	]
})

@RouteConfig([
	{
		component: Home,
		path: '/'
	}
])

export class App {
	router: Router;
	constructor(router: Router) {
		this.router = Router;
	}
}