import {ViewEncapsulation, Component} from 'angular2/core';

import {AuthClient} from '../../services';

const COMPONENT_BASE_PATH = './app/components/reset_password';

@Component({
	selector: 'reset-password',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/reset_password.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/reset_password.css`
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
