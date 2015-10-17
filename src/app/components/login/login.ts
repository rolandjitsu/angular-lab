import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component,
	View
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { isNativeShadowDomSupported } from '../../../common/lang';
import { AuthClient } from '../../services';

@Component({
	selector: 'login'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/login/login.html',
	styleUrls: [
		'app/components/login/login.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})

export class Login {
	isAuthenticationFailed: boolean = false;
	isAuthenticating: boolean = false;
	credentials: FirebaseCredentials = {
		email: '',
		password: ''
	};
	private _client: AuthClient;
	constructor(client: AuthClient) {
		this._client = client;
	}
	submit() {
		this.isAuthenticationFailed = false;
		this.isAuthenticating = true;
		this._client.login(this.credentials).then(null, (error) => {
				this.isAuthenticationFailed = true;
				this.isAuthenticating = false;
			}
		);
	}
}