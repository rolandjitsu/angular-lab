import {
	Inject,
	ElementRef,
	Component,
	View,
	CORE_DIRECTIVES,
	ViewEncapsulation
} from 'angular2/angular2';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { isNativeShadowDomSupported } from 'common/lang';
import { Animation, AnimationEndObservable } from 'common/animation';
import { LowerCasePipe } from 'app/pipes';
import { Logo } from 'app/directives';
import { Todos } from '../todos/todos';

@Component({
	selector: 'app'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/app/app.html',
	styleUrls: [
		'app/components/app/app.css'
	],
	directives: [
		CORE_DIRECTIVES,
		ROUTER_DIRECTIVES,
		Logo
	],
	pipes: [
		LowerCasePipe
	]
})

@RouteConfig([
	{
		component: Todos,
		path: '/',
		as: 'Todos'
	}
])

export class App {
	loading: boolean = true;
	constructor(@Inject(ElementRef) elementRef, router: Router) {
		let that: App = this;
		let root: Firebase = new Firebase('https://ng2-lab.firebaseio.com');

		root.onAuth(auth => {
			if (auth === null) root.authAnonymously(() => {
				// Successful auth
			});
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

		let el: Element = elementRef.nativeElement;
		let prefixSelector = isNativeShadowDomSupported ? '* /deep/ ' : '';
		let main: Element = el.querySelector(prefixSelector + '.js-main');
		let logo: Element = el.querySelector(prefixSelector + '.js-logo');
		let mainSub = AnimationEndObservable.subscribe(
			main,
			(event) => {
				main.classList.remove('js-npe');
				mainSub.dispose();
			},
			this
		);
		let logoSub = AnimationEndObservable.subscribe(
			logo,
			(event) => {
				if (event.animationName === 'in') logo.className = logo.className.replace('js-in', 'js-opaque');
				else if (event.animationName === 'move') {
					logo.classList.remove('js-move', 'js-opaque');
					logo.classList.add('js-unfix');
					logoSub.dispose();
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