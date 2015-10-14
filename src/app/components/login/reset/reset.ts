import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	ViewEncapsulation,
	Component,
	View
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { resetLogin } from 'common/authentication';
import { isNativeShadowDomSupported } from 'common/lang';

@Component({
	selector: 'reset'
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/login/reset/reset.html',
	styleUrls: [
		'app/components/login/reset/reset.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES
	]
})


export class Reset {
	isResetAttemptFailed: boolean = false;
	isResetAttemptSuccessful: boolean = false;
	error: string = null;
	isResetting: boolean = false;
	private credentials: FirebaseResetPasswordCredentials = {
		email: ''
	};
	submit() {
		this.isResetAttemptFailed = false;
		this.error = null;
		this.isResetting = true; 
		resetLogin(this.credentials).then(
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