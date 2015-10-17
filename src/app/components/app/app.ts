import {
	ElementRef,
	Component,
	View,
	CORE_DIRECTIVES,
	ViewEncapsulation
} from 'angular2/angular2';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { AuthClient } from '../../services';
import { isNativeShadowDomSupported } from '../../../common/lang';
import { Animation, AnimationEndObservable } from '../../../common/animation';
import { LowerCasePipe } from '../../pipes';
import { Logo, AuthOutlet } from '../../directives';
import { Login } from '../login/login';
import { ResetPassword } from '../reset_password/reset_password';
import { ChangePassword } from '../change_password/change_password';
import { Register } from '../register/register';
import { Home } from '../home/home';

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
		AuthOutlet,
		Logo
	],
	pipes: [
		LowerCasePipe
	]
})

@RouteConfig([
	{
		component: Home,
		path: '/',
		as: 'Home'
	},
	{
		component: Login,
		path: '/login',
		as: 'Login'
	},
	{
		component: ResetPassword,
		path: '/login/reset',
		as: 'ResetPassword'
	},
	{
		component: ChangePassword,
		path: '/login/change',
		as: 'ChangePassword'
	},
	{
		component: Register,
		path: '/register',
		as: 'Register'
	}
])

export class App {
	loading: boolean = true;
	constructor(elementRef: ElementRef, router: Router, client: AuthClient) {

		let timeout;
		router.subscribe((path) => {
			if (!this.loading || timeout) return;
			timeout = setTimeout(
				(_) => this.loading = false,
				3000
			);
		});


		/**
		 * Authentication
		 */

		client.observe((auth: FirebaseAuthData) => {
			let instruction;
			if (auth) instruction = router.generate(['/Home']);
			else instruction = router.generate(['/Login']);
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