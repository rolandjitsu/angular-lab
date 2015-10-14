import { ComponentInstruction } from 'angular2/router';

let rootFirebaseRef: Firebase = new Firebase('https://ng2-lab.firebaseio.com');

export function isUserAuthenticated (route?: ComponentInstruction): boolean {
	let auth: FirebaseAuthData = rootFirebaseRef.getAuth();
	return auth ? true : false;
}

const FIREBASE_LOGIN_REMEMBER_OPTIONS = [
	'default',
	'sessionOnly',
	'none'
];

export enum FirebaseLoginRememberOptions {
	DEFAULT,
	SESSION_ONLY,
	NONE
}

export function login (credentials: FirebaseCredentials, remember?: FirebaseLoginRememberOptions): Promise<FirebaseAuthData | any> {
	let opts = {
		remember: FIREBASE_LOGIN_REMEMBER_OPTIONS[0]
	};
	if (typeof remember !== 'undefined') opts.remember =FIREBASE_LOGIN_REMEMBER_OPTIONS[remember]; 
	return new Promise((resolve, reject) => {
		rootFirebaseRef.authWithPassword(credentials, (error, auth: FirebaseAuthData) => { // https://www.firebase.com/docs/web/guide/login/password.html#section-logging-in
			if (error) reject(error);
			else resolve(auth);
		}, opts);
	});
}

export function resetLogin (credentials: FirebaseResetPasswordCredentials): Promise<any> {
	return new Promise((resolve, reject) => {
		rootFirebaseRef.resetPassword(credentials, (error) => {
			if (error) reject(error);
			else resolve();
		});
	});
}

export function changeLogin (credentials: FirebaseChangePasswordCredentials): Promise<any> {
	return new Promise((resolve, reject) => {
		rootFirebaseRef.changePassword(credentials, (error) => {
			if (error) reject(error);
			else resolve();
		});
	});
}

export function register (credentials: FirebaseCredentials): Promise<FirebaseAuthData | any> {
	return new Promise((resolve, reject) => {
		rootFirebaseRef.createUser(credentials, (error, auth: FirebaseAuthData) => {
			if (error) reject(error);
			else resolve(auth);
		});
	});
}

export class AuthenticationObservable {
	private _subscriber: any;
	static subscribe(subscriber): AuthenticationObservable {
		return new AuthenticationObservable(subscriber);
	}
	constructor(subscriber: (auth?: FirebaseAuthData, rootFirebaseRef?: Firebase) =>  void) {
		this._subscriber = (auth: FirebaseAuthData) => {
			subscriber(auth, rootFirebaseRef);
		};
		rootFirebaseRef.onAuth(this._subscriber);
	}
	dispose() {
		rootFirebaseRef.offAuth(this._subscriber);
	}
}