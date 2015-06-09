import { Component, View } from 'angular2/angular2';
import { NgFor, NgIf } from 'angular2/angular2';
import { RouteConfig, RouterOutlet, RouterLink, Router } from 'angular2/router';
import { BrowserLocation } from 'angular2/src/router/browser_location';

import { routes, IRoute } from 'app/routes';

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
	routes: Array<IRoute<any>>;

	constructor(router: Router, browserLocation: BrowserLocation) {
		this.routes = routes;
		let uri: string = browserLocation.path();
		let root: Firebase = new Firebase("https://ng2-play.firebaseio.com");
		let auth: FirebaseAuthData = root.getAuth();
		router.navigate(auth === null ? '/' : uri); // we need to manually go to the correct uri until the router is fixed
		root.onAuth(auth => {
			if (auth === null) root.authAnonymously(() => {});
		});
	}
}