import { Component, View } from 'angular2/angular2';
import { NgIf } from 'angular2/directives';
import { RouteConfig, RouterOutlet, Router } from 'angular2/router';
import { BrowserLocation } from 'angular2/src/router/browser_location';

import { routes, IRoute } from 'app/routes';

import { Nav } from '../nav/nav';

@Component({
	selector: 'app'
})

@View({
	templateUrl: 'app/components/app/app.html',
	directives: [
		NgIf,
		RouterOutlet,
		Nav
	]
})

@RouteConfig(
	Array.from(routes)
)

export class App {
	routes: Array<IRoute<any>>;
	loading: boolean = true;
	constructor(router: Router, browserLocation: BrowserLocation) {
		this.routes = routes;
		let that: App = this;
		let uri: string = browserLocation.path();
		let root: Firebase = new Firebase("https://ng2-play.firebaseio.com");
		let auth: FirebaseAuthData = root.getAuth();
		router
			.navigate(auth === null ? '/' : uri) // we need to manually go to the correct uri until the router is fixed
			.then((_) => setTimeout(
				(_) => that.loading = false,
				3000
			));
		root.onAuth(auth => {
			if (auth === null) root.authAnonymously(() => {});
		});
	}
}