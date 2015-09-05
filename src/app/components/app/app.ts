import {
	ElementRef,
	Component,
	ViewMetadata,
	View,
	NgClass,
	ViewEncapsulation
} from 'angular2/angular2';
import { Router, RouteConfig, RouterOutlet, RouterLink } from 'angular2/router';

import { isNativeShadowDomSupported } from 'common/lang';
import { Animation, AnimationEndObservable } from 'common/animation';
import { LowerCasePipe } from 'app/pipes';
import { Logo } from 'app/directives';
import { Todos } from '../todos/todos';

@Component({
	selector: 'app'
})

@View(<ViewMetadata>{
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED, NATIVE, NONE (default)
	templateUrl: 'app/components/app/app.html',
	styleUrls: [
		'app/components/app/app.css'
	],
	directives: [
		NgClass,
		RouterOutlet,
		RouterLink,
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
		as: 'todos'
	}
])

export class App {
	loading: boolean = true;
	constructor(private elementRef: ElementRef, router: Router) {
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

		let el: Element = this.elementRef.nativeElement;
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