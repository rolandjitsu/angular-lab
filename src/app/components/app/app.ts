import { Component, View } from 'angular2/annotations';
import { ViewContainerRef, ElementRef } from 'angular2/core';
import { Router, RouteConfig, RouterOutlet, RouterLink } from 'angular2/router';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { Animation, AnimationEndObserver } from 'common/animation';
import { Logo } from 'app/directives';
import { Todos } from '../todos/todos';

interface IRoute<T> {
	path: string,
	component?: T,
	redirectTo?: string,
	as?: string
}

interface IRoutes {
	[index: number]: IRoute<any>
}

let routes: IRoutes = [
	{
		component: Todos,
		path: '/',
		as: 'todos'
	}
]

@Component({
	selector: 'app'
})

@View({
	templateUrl: 'app/components/app/app.html',
	styleUrls: [
		'app/components/app/app.css'
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
	constructor(private viewContainer: ViewContainerRef, private elementRef: ElementRef, router: Router) {
		let that: App = this;
		let root: Firebase = new Firebase("https://ng2-play.firebaseio.com");
		let auth: FirebaseAuthData = root.getAuth();

		root.onAuth(auth => {
			if (auth === null) root.authAnonymously(() => {});
		});
		router.subscribe((path) => {
			if (!that.loading) return;
			setTimeout(
				(_) => that.loading = false,
				3000
			);
		});
		
		
		/**
		 * Animations
		 */
		
		let el: HTMLElement = this.elementRef.nativeElement;
		let prefixSelector = isNativeShadowDOMSupported ? '* /deep/ ' : '';
		let main: HTMLElement = <HTMLElement>el.querySelector(prefixSelector + '.js-main'); // soon use '>>>' https://www.chromestatus.com/features/6750456638341120
		let logo: HTMLElement = <HTMLElement>el.querySelector(prefixSelector + '.js-logo');
		let mainSub = AnimationEndObserver.subscribe(
			main,
			(event) => {
				main.classList.remove('js-npe');
				mainSub.disconnect();
			},
			this
		);
		let logoSub = AnimationEndObserver.subscribe(
			logo,
			(event) => {
				if (event.animationName === 'in') logo.className = logo.className.replace('js-in', 'js-opaque');
				else if (event.animationName === 'move') {
					logo.classList.remove('js-move', 'js-opaque');
					logo.classList.add('js-unfix');
					logoSub.disconnect();
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