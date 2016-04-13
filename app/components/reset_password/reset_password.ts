import {
	Component,
	ViewEncapsulation
} from 'angular2/core';

import {MdLiveAnnouncer, AuthClient} from 'app/services';

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

	private _live: MdLiveAnnouncer;
	private _client: AuthClient;

	constructor(live: MdLiveAnnouncer, client: AuthClient) {
		this._live = live;
		this._client = client;
	}

	submit() {
		this.isResetAttemptFailed = false;
		this.error = null;
		this.isResetting = true;
		this._live.announce(`Reset password for ${this.credentials.email}`);
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
