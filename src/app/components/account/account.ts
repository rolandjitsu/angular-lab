import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { AuthClient } from '../../services';

@Component({
	selector: 'account',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: 'app/components/account/account.html',
	styleUrls: [
		'app/components/account/account.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})

export class Account {
	isChangeAttemptFailed: boolean = false;
	isChangeAttemptSuccessful: boolean = false;
	error: string = null;
	isChanging: boolean = false;
	credentials: FirebaseChangePasswordCredentials = {
		email: '',
		oldPassword: '',
		newPassword: ''
	};
	private _client: AuthClient;
	constructor(client: AuthClient) {
		this._client = client;
		if (client.session) this.credentials.email = client.session.password.email;
	}
	submit() {
		this.isChangeAttemptFailed = false;
		this.isChangeAttemptSuccessful = false;
		this.error = null;
		this.isChanging = true;
		this._client.changePassword(this.credentials).then(
			() => {
				this.isChangeAttemptSuccessful = true;
				this.isChanging = false;
				this.credentials.oldPassword = '';
				this.credentials.newPassword = '';
			},
			(error) => {
				this.isChangeAttemptFailed = true;
				this.isChanging = false;
				if (error) {
					switch (error.code) {
						case 'INVALID_PASSWORD':
							this.error = 'The specified current password is incorrect.';
							break;
						default:
							break;
					}
				}
			}
		);
	}
}