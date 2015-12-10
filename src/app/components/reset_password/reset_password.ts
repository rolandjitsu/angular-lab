import {ViewEncapsulation, Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {AuthClient} from '../../services';

@Component({
	moduleId: module.id, // CommonJS standard
	selector: 'reset-password',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: './reset_password.html',
	styleUrls: [
		'./reset_password.css'
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
							this.error = 'Specified user account does not exist.';
							break;
						default:
							break;
					}
				}
			}
		);
	}
}