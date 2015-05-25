import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { RouteConfigAnnotation as RouteConfig, RouterOutlet, RouterLink, Router } from 'angular2/router';
import { BrowserLocation } from 'angular2/src/router/browser_location';
import { Home } from 'components/home/home';

@Component({
	selector: 'app'
})

@View({
	template: `
		<main>
			<content></content>
			<router-outlet></router-outlet>
		</main>
	`,
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
	constructor(router: Router, browserLocation: BrowserLocation) {
		this.router = Router;
		let uri = browserLocation.path();
		router.navigate(uri);
	}
}