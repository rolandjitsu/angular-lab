import {
	Component,
	ViewEncapsulation
} from 'angular2/core';

import {
	MdLiveAnnouncer,
	AuthClient,
	FirebaseAuthProvider
} from 'app/services';

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
	
	private _live: MdLiveAnnouncer;
	private _client: AuthClient;

	constructor(live: MdLiveAnnouncer, client: AuthClient) {
		this._live = live;
		this._client = client;
	}
	
	loginWithGithub(event: MouseEvent) {
		this._client.loginWithProvider(FirebaseAuthProvider.Github, this.remember);
		this._live.announce('Login with Github');
	}
	
	loginWithGoogle(event: MouseEvent) {
		this._client.loginWithProvider(FirebaseAuthProvider.Google, this.remember);
		this._live.announce('Login with Google');
	}
	
	loginWithCredentials() {
		this.isAuthenticationFailed = false;
		this.isAuthenticating = true;
		this._live.announce('Login with email and password');
		this._client.loginWithCredentials(this.credentials, this.remember).then(null, (error) => {
				this.isAuthenticationFailed = true;
				this.isAuthenticating = false;
			}
		);
	}
}
