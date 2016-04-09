import {
	ViewEncapsulation,
	Component
} from 'angular2/core';

import {AuthClient} from '../../services';

import {UserAvailabilityValidator} from '../../validators';

const COMPONENT_BASE_PATH = './app/components/register';

@Component({
	selector: 'register',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/register.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/register.css`
	],
	directives: [
		UserAvailabilityValidator
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
