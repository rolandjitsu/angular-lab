import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component,
	View
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { login, changeLogin } from 'common/authentication';
import { isNativeShadowDomSupported } from 'common/lang';

@Component({
	selector: 'change'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/login/change/change.html',
	styleUrls: [
		'app/components/login/change/change.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})


export class Change {
	isChangeAttemptFailed: boolean = false;
	error: string = null;
	isChanging: boolean = false;
	private credentials: FirebaseChangePasswordCredentials = {
		email: '',
		oldPassword: '',
		newPassword: ''
	};
	constructor(router: Router) {
		router.subscribe((path) => {
			console.log(path);
		});
	}
	submit() {
		this.isChangeAttemptFailed = false;
		this.error = null;
		this.isChanging = true; 
		changeLogin(this.credentials).then(
			() => login({
				email: this.credentials.email,
				password: this.credentials.newPassword
			}),
			(error) => {
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
			}
		);
	}
}