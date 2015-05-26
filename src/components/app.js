import { NgFor, NgIf } from 'angular2/directives';
import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { BrowserLocation } from 'angular2/src/router/browser_location';
import { RouteConfigAnnotation as RouteConfig, RouterOutlet, RouterLink, Router } from 'angular2/router';
import { routes } from 'routes';

@Component({
	selector: 'app'
})

@View({
	template: `
		<header></header>
		<nav *ng-if="routes.length > 1">
			<ul>
				<li *ng-for="#route of routes; #i = index">
					<a router-link="{{ route.component.name | lowercase }}">{{route.component.name}}</a>
				</li>
			</ul>
		</nav>
		<main>
			<content></content>
			<router-outlet></router-outlet>
		</main>
		<footer></footer>
	`,
	directives: [
		NgFor,
		NgIf,
		RouterOutlet,
		RouterLink
	]
})

@RouteConfig(
	Array.from(routes)
)

export class App {
	routes: routes;
	router: Router;
	constructor(router: Router, browserLocation: BrowserLocation) {
		this.routes = routes;
		this.router = Router;
		// we need to manually go to the correct uri until the router is fixed
		let uri = browserLocation.path();
		router.navigate(uri);
	}
}