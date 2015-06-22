import { BrowserLocation } from 'angular2/src/router/browser_location';
import { Component, View } from 'angular2/annotations';
import { ViewContainerRef, ElementRef } from 'angular2/core';
import { Router, RouteConfig, RouterOutlet, RouterLink } from 'angular2/router';

import { Animation, AnimationEndObserver } from 'app/services';
import { Logo } from 'app/directives';
import { Todos } from '../todos/todos';

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
		RouterLink,
		Logo
	]
})

@RouteConfig(routes)

export class App {
	loading: boolean = true;
	constructor(private viewContainer: ViewContainerRef, private elementRef: ElementRef, router: Router, browserLocation: BrowserLocation) {
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
		
		
		/**
		 * Animations
		 */
		
		let el: HTMLElement = this.elementRef.domElement;
		let main: HTMLElement = <HTMLElement>el.querySelector('* /deep/ .js-main');
		let logo: HTMLElement = <HTMLElement>el.querySelector('* /deep/ .js-logo');
		let mainSub = AnimationEndObserver.subscribe(
			main,
			(event) => {
				main.classList.remove('js-npe');
				mainSub.disconnect();
			},
			this
		);
		let sub = AnimationEndObserver.subscribe(
			logo,
			(event) => {
				if (event.animationName === 'in') logo.className = logo.className.replace('js-in', 'js-opaque');
				else if (event.animationName === 'move') {
					logo.classList.remove('js-move', 'js-opaque');
					logo.classList.add('js-unfix');
					sub.disconnect();
				}
			},
			this
		);
		Animation.rAF(
			(_) => logo.classList.add('js-in'),
			this
		);
	}
}