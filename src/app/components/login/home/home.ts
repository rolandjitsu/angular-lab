import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component,
	View
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { login } from 'common/authentication';
import { isNativeShadowDomSupported } from 'common/lang';

@Component({
	selector: 'home'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/login/home/home.html',
	styleUrls: [
		'app/components/login/home/home.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})

export class Home {
	isAuthenticationFailed: boolean = false;
	isAuthenticating: boolean = false;
	private credentials: FirebaseCredentials = {
		email: '',
		password: ''
	};
	submit() {
		this.isAuthenticationFailed = false;
		this.isAuthenticating = true;
		login(this.credentials).then(
			() => this.isAuthenticating = false,
			(error) => {
				this.isAuthenticationFailed = true;
				this.isAuthenticating = false;
			}
		);
	}
}