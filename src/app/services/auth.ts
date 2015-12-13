import {Observable} from 'rxjs/Observable';

import {FIREBASE_APP_LINK} from './firebase';

const FIREBASE_AUTH_PROVIDER = [
	'password',
	'github',
	'google',
	'facebook',
	'twitter'
];

export enum FirebaseAuthProvider {
	Password,
	Github,
	Google,
	Facebook,
	Twitter
}

export function isUserAuthenticated(): boolean {
	let firebaseRef = new Firebase(`${FIREBASE_APP_LINK}`);
	let session = firebaseRef.getAuth();
	return !!session;
}

function getAuthDefaultOpts(remember?: boolean): any {
	return {
		remember: typeof remember === 'boolean' && !remember ? 'sessionOnly' : 'default'
	};
}

function addScope(target: string[], scope: string): string[] {
	if (!Array.isArray(target)) target = [scope];
	else if (!target.length || !target.includes(scope)) target = target.concat([scope]);
	return target;
}

export class AuthClient  {
	session: Observable<FirebaseAuthData>;
	private _firebaseRef: Firebase = new Firebase(`${FIREBASE_APP_LINK}`);

	constructor() {
		this.session = new Observable<FirebaseAuthData>((observer) => {
			let callback = (auth: FirebaseAuthData) => {
				observer.next(auth);
			};
			this._firebaseRef.onAuth(callback);
			return () => {
				this._firebaseRef.offAuth(callback);
			};
		});
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
		let opts = getAuthDefaultOpts(remember);
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
	// [Github Scopes]{@link https://developer.github.com/v3/oauth/#scopes}
	// [Google]{@link https://www.firebase.com/docs/web/guide/login/google.html}
	// [Google Scopes]{@link https://developers.google.com/+/web/api/rest/oauth#scopes}
	// [Facebook]{@link https://www.firebase.com/docs/web/guide/login/facebook.html}
	// [Facebook Scopes]{@link https://developers.facebook.com/docs/facebook-login/permissions/v2.5}
	// [Twitter]{@link https://www.firebase.com/docs/web/guide/login/twitter.html}
	loginWithProvider(provider: FirebaseAuthProvider, remember?: boolean, scopes?: string[]): Promise<any> {
		let opts = getAuthDefaultOpts(remember);
		// Github, Google and Facebook does not include the email address in it's data unless required specifically.
		// The User service `.fromAuth()` depends on the email, so we ask for it.
		scopes = addScope(scopes, provider === FirebaseAuthProvider.Github ? 'user:email' : 'email');
		if (Array.isArray(scopes) && provider !== FirebaseAuthProvider.Twitter) opts.scope = scopes.join(',');
		return new Promise((resolve, reject) => {
			this._firebaseRef.authWithOAuthRedirect(
				FIREBASE_AUTH_PROVIDER[provider],
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
	logout(): void {
		this._firebaseRef.unauth();
	}
}