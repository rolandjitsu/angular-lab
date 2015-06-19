import { Component, View } from 'angular2/annotations';
import { RouteConfig, RouterOutlet, Router } from 'angular2/router';
import { BrowserLocation } from 'angular2/src/router/browser_location';

import { Todos } from '../todos/todos';
import { Logo } from '../logo/logo';

interface IRoute<T> {
	component: T,
	path: string,
	as?: string
}

interface IRoutes {
	[index: number]: IRoute<any>
}

let routes: IRoutes = [
	{
		component: Todos,
		path: '/routefix', // temp fix until router is fixed, when fixed remove fron router.navigate below
		as: 'todos'
	}
]

@Component({
	selector: 'app'
})

@View({
	templateUrl: 'app/components/app/app.html',
	styles: [
		'@import "app.css";'
	],
	directives: [
		RouterOutlet,
		Logo
	]
})

@RouteConfig(routes)

export class App {
	loading: boolean = true;
	constructor(router: Router, browserLocation: BrowserLocation) {
		let that: App = this;
		let uri: string = browserLocation.path();
		let root: Firebase = new Firebase("https://ng2-play.firebaseio.com");
		let auth: FirebaseAuthData = root.getAuth();
		router
			.navigate('/routefix') // temp fix until router is fixed
			// .navigate(auth === null ? '/routefix' : uri) // we need to manually go to the correct uri until the router is fixed
			.then((_) => setTimeout(
				(_) => that.loading = false,
				3000
			));
		root.onAuth(auth => {
			if (auth === null) root.authAnonymously(() => {});
		});
	}
}