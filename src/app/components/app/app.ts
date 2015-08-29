import {
	ViewContainerRef,
	ElementRef,
	Component,
	View,
	ViewEncapsulation
} from 'angular2/angular2';
import { Router, RouteConfig, RouterOutlet, RouterLink } from 'angular2/router';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { Animation, AnimationEndObserver } from 'common/animation';
import { LowerCasePipe } from 'app/pipes';
import { Logo } from 'app/directives';
import { Todos } from '../todos/todos';

interface IRoute<T> {
	path: string;
	component?: T;
	redirectTo?: string;
	as?: string;
}

interface IRoutes {
	[index: number]: IRoute<any>;
}

let routes: IRoutes = [
	{
		component: Todos,
		path: '/',
		as: 'todos'
	}
];

@Component({
	selector: 'app'
})

@View({
	encapsulation: isNativeShadowDOMSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED (default), NATIVE, NONE
	templateUrl: 'app/components/app/app.html',
	styleUrls: [
		'app/components/app/app.css'
	],
	directives: [
		RouterOutlet,
		RouterLink,
		Logo
	],
	pipes: [
		LowerCasePipe
	]
})

@RouteConfig(routes)

export class App {
	loading: boolean = true;
	constructor(private viewContainer: ViewContainerRef, private elementRef: ElementRef, router: Router) {
		let that: App = this;
		let root: Firebase = new Firebase('https://ng2-play.firebaseio.com');

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
		let prefixSelector = isNativeShadowDOMSupported ? '* /deep/ ' : ''; // soon use '>>>' https://www.chromestatus.com/features/6750456638341120
		let main: HTMLElement = <HTMLElement>el.querySelector(prefixSelector + '.js-main');
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