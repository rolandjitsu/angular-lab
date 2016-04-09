import {
	ViewEncapsulation,
	Component
} from 'angular2/core';

import {AuthClient, FirebaseAuthProvider} from '../../services';

const COMPONENT_BASE_PATH = './app/components/login';

@Component({
	selector: 'login',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/login.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/login.css`
	]
})

export class Login {
	isAuthenticationFailed: boolean = false;
	isAuthenticating: boolean = false;
	remember: boolean = false;
	credentials: FirebaseCredentials = {
		email: '',
		password: ''
	};
	private _client: AuthClient;
	constructor(client: AuthClient) {
		this._client = client;
	}
	loginWithGithub(event: MouseEvent) {
		this._client.loginWithProvider(FirebaseAuthProvider.Github, this.remember);
	}
	loginWithGoogle(event: MouseEvent) {
		this._client.loginWithProvider(FirebaseAuthProvider.Google, this.remember);
	}
	loginWithCredentials() {
		this.isAuthenticationFailed = false;
		this.isAuthenticating = true;
		this._client.loginWithCredentials(this.credentials, this.remember).then(null, (error) => {
				this.isAuthenticationFailed = true;
				this.isAuthenticating = false;
			}
		);
	}
}
