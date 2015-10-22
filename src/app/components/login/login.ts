import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { AuthClient } from '../../services';

@Component({
	selector: 'login',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
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
	remember: boolean = false;
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
		this._client.login(this.credentials, this.remember).then(null, (error) => {
				this.isAuthenticationFailed = true;
				this.isAuthenticating = false;
			}
		);
	}
}