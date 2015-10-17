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
	selector: 'reset-password'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/reset_password/reset_password.html',
	styleUrls: [
		'app/components/reset_password/reset_password.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})


export class ResetPassword {
	isResetAttemptFailed: boolean = false;
	isResetAttemptSuccessful: boolean = false;
	error: string = null;
	isResetting: boolean = false;
	credentials: FirebaseResetPasswordCredentials = {
		email: ''
	};
	private _client: AuthClient;
	constructor(client: AuthClient) {
		this._client = client;
	}
	submit() {
		this.isResetAttemptFailed = false;
		this.error = null;
		this.isResetting = true; 
		this._client.resetPassword(this.credentials).then(
			() => {
				this.isResetAttemptSuccessful = true;
				this.isResetting = false;
			},
			(error) => {
				this.isResetAttemptFailed = true;
				this.isResetting = false;
				if (error) {
					switch (error.code) {
						case 'INVALID_USER':
							this.error = 'The specified user account does not exist.';
							break;
						default:
							break;
					}
				}
			}
		);
	}
}