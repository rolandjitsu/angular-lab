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
	selector: 'register'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/register/register.html',
	styleUrls: [
		'app/components/register/register.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})


export class Register {
	isRegistrationFailed: boolean = false;
	error: string = null;
	isRegistering: boolean = false;
	credentials: FirebaseCredentials = {
		email: '',
		password: ''
	};
	private _client: AuthClient;
	constructor(client: AuthClient) {
		this._client = client;
	}
	submit() {
		this.isRegistrationFailed = false;
		this.error = null;
		this.isRegistering = true; 
		this._client.register(this.credentials).then(null, (error) => {
			this.isRegistrationFailed = true;
			this.isRegistering = false;
			if (error) {
				switch (error.code) {
					case 'EMAIL_TAKEN':
						this.error = 'The new user account cannot be created because the email is already in use.';
						break;
					case 'INVALID_EMAIL':
						this.error = 'The specified email is not a valid email.';
						break;
					default:
						break;
				}
			}
		});
	}
}