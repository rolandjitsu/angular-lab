export class AuthClient {
	private _firebaseRef: Firebase;
	constructor(firebaseRef: Firebase) {
		this._firebaseRef = firebaseRef;
	}
	register(credentials: FirebaseCredentials): Promise<FirebaseAuthData | any> {
		return new Promise((resolve, reject) => {
			this._firebaseRef.createUser(credentials, (error, auth: FirebaseAuthData) => {
				if (error) reject(error);
				else this.login(credentials).then((auth: FirebaseAuthData) => {
					resolve(auth);
				})
			});
		});
	}
	login(credentials: FirebaseCredentials, remember?: boolean): Promise<FirebaseAuthData | any> {
		let opts = {
			remember: typeof remember === 'boolean' && !remember ? 'none': 'default'
		};
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
		return this._firebaseRef.getAuth() !== null;
	}
	logout(): void {
		this._firebaseRef.unauth();
	}
}