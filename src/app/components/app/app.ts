import {
	ElementRef,
	Component,
	View,
	CORE_DIRECTIVES,
	ViewEncapsulation
} from 'angular2/angular2';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { AuthenticationObservable } from 'common/authentication';
import { isNativeShadowDomSupported } from 'common/lang';
import { Animation, AnimationEndObservable } from 'common/animation';
import { LowerCasePipe } from 'app/pipes';
import { Logo } from 'app/directives';
import { Login } from '../login/login';
import { Register } from '../register/register';
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
	},
	{
		component: Login,
		path: '/login/...',
		as: 'Login'
	},
	{
		component: Register,
		path: '/register',
		as: 'Register'
	}
])

export class App {
	loading: boolean = true;
	constructor(elementRef: ElementRef, router: Router) {

		let that: App = this;
		let timeout;
		router.subscribe((path) => {
			if (!this.loading || timeout) return;
			timeout = setTimeout(
				(_) => that.loading = false,
				3000
			);
		});


		/**
		 * Authentication
		 */

		AuthenticationObservable.subscribe((auth: FirebaseAuthData) => {
			let instruction;
			if (auth) instruction = router.generate(['/Todos']);
			else instruction = router.generate(['/Login/Home']);
			router.navigateByInstruction(instruction);
		});


		/**
		 * Animations
		 */

		let el: Element = elementRef.nativeElement;
		let prefixSelector = isNativeShadowDomSupported ? '* /deep/ ' : '';
		let main: Element = el.querySelector(`${prefixSelector}.js-main`);
		let logo: Element = el.querySelector(`${prefixSelector}.js-logo`);
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