import { NgFor, NgIf } from 'angular2/directives';
import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';
import { BrowserLocation } from 'angular2/src/router/browser_location';
import { RouterOutlet, RouterLink, Router } from 'angular2/router';
// import { RouteConfigAnnotation as RouteConfig } from 'angular2/src/router/route_config_decorator'

import { routes } from 'app/routes';

// console.log(RouteConfig, Router)

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

// @RouteConfig(
// 	Array.from(routes)
// )

export class App {
	routes: routes;
	router: Router;
	constructor(router: Router, browserLocation: BrowserLocation) {
		this.routes = routes;
		this.router = Router;

		let uri = browserLocation.path();
		let root = new Firebase("https://ng2-play.firebaseio.com");
		let auth = root.getAuth();
		router.config(Array.from(routes)).then((_) => router.navigate(auth === null ? '/' : uri)); // we need to manually go to the correct uri until the router is fixed
		root.onAuth((auth) => {
			if (auth === null) root.authAnonymously(() => {});
		});
	}
}