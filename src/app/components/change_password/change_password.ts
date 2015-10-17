import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component,
	View
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { isNativeShadowDomSupported } from '../../../common/lang';
import { AuthClient } from '../../services';

@Component({
	selector: 'change-password'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/change_password/change_password.html',
	styleUrls: [
		'app/components/change_password/change_password.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})


export class ChangePassword {
	isChangeAttemptFailed: boolean = false;
	error: string = null;
	isChanging: boolean = false;
	credentials: FirebaseChangePasswordCredentials = {
		email: '',
		oldPassword: '',
		newPassword: ''
	};
	private _client: AuthClient;
	constructor(router: Router, client: AuthClient) {
		this._client = client;
		router.subscribe((path) => {
			console.log(path);
		});
	}
	submit() {
		this.isChangeAttemptFailed = false;
		this.error = null;
		this.isChanging = true; 
		this._client.changePassword(this.credentials).then(null, (error) => {
			this.isChangeAttemptFailed = true;
			this.isChanging = false;
			if (error) {
				switch (error.code) {
					case 'INVALID_PASSWORD':
						this.error = 'The provided user account token is incorrect or it has expired.';
						break;
					case 'INVALID_USER':
						this.error = 'The specified user account does not exist.';
						break;
					default:
						break;
				}
			}
		});
	}
}