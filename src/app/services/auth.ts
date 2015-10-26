const FIREBASE_AUTH_PROVIDERS = [
	'password',
	'github',
	'google',
	'facebook',
	'twitter'
];

export enum FirebaseAuthProviders {
	Password,
	Github,
	Google,
	Facebook,
	Twitter
}

function authOptionsDefaults (remember?: boolean): any {
	return {
		remember: typeof remember === 'boolean' && !remember ? 'sessionOnly' : 'default'
	};
}

export class AuthClient {
	private _firebaseRef: Firebase;
	constructor(firebaseRef: Firebase) {
		this._firebaseRef = firebaseRef;
	}
	get session(): FirebaseAuthData {
		return this._firebaseRef.getAuth();
	}
	register(credentials: FirebaseCredentials): Promise<FirebaseAuthData | any> {
		return new Promise((resolve, reject) => {
			this._firebaseRef.createUser(credentials, (error) => {
				if (error) reject(error);
				else this.loginWithCredentials(credentials).then((auth: FirebaseAuthData) => {
					resolve(auth);
				});
			});
		});
	}
	// [User Authentication]{@link https://www.firebase.com/docs/web/guide/user-auth.html}
	// [Email & Password]{@link https://www.firebase.com/docs/web/guide/login/password.html}
	loginWithCredentials(credentials: FirebaseCredentials, remember?: boolean): Promise<FirebaseAuthData | any> {
		let opts = authOptionsDefaults(remember);
		return new Promise((resolve, reject) => {
			this._firebaseRef.authWithPassword(
				credentials,
				(error, auth: FirebaseAuthData) => { // https://www.firebase.com/docs/web/guide/login/password.html#section-logging-in
					if (error) reject(error);
					else resolve(auth);
				},
				opts
			);
		});
	}
	// [Github]{@link https://www.firebase.com/docs/web/guide/login/github.html}
	// [Scopes]{@link https://developer.github.com/v3/oauth/#scopes}
	// [Google]{@link https://www.firebase.com/docs/web/guide/login/google.html}
	// [Scopes]{@link https://developers.google.com/+/web/api/rest/oauth#scopes}
	// [Facebook]{@link https://www.firebase.com/docs/web/guide/login/facebook.html}
	// [Scopes]{@link https://developers.facebook.com/docs/facebook-login/permissions/v2.5}
	// [Twitter]{@link https://www.firebase.com/docs/web/guide/login/twitter.html}
	loginWithProvider(provider: FirebaseAuthProviders, remember?: boolean, scope?: any): Promise<any> {
		let opts = authOptionsDefaults(remember);
		if (scope && provider !== FirebaseAuthProviders.Twitter) opts.scope = scope;
		return new Promise((resolve, reject) => {
			this._firebaseRef.authWithOAuthRedirect(
				FIREBASE_AUTH_PROVIDERS[provider],
				(error) => {
					if (error) reject(error);
				},
				opts
			);
		});
	}
	resetPassword(credentials: FirebaseResetPasswordCredentials): Promise<any> {
		return new Promise((resolve, reject) => {
			this._firebaseRef.resetPassword(credentials, (error) => {
				if (error) reject(error);
				else resolve();
			});
		});
	}
	changePassword(credentials: FirebaseChangePasswordCredentials): Promise<any> {
		return new Promise((resolve, reject) => {
			this._firebaseRef.changePassword(credentials, (error) => {
				if (error) reject(error);
				else resolve();
			});
		});
	}
	observe(callback: (auth?: FirebaseAuthData) => void): Function {
		this._firebaseRef.onAuth(callback);
		return () => {
			this._firebaseRef.offAuth(callback);
		};
	}
	isAuthenticated(): boolean {
		return this.session !== null;
	}
	logout(): void {
		this._firebaseRef.unauth();
	}
}