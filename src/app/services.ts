import { provide, OpaqueToken } from 'angular2/angular2';
import { Http } from 'angular2/http';

import { AuthenticationObservable } from 'common/authentication';
import { Defer } from 'common/async';
import { IconStore } from 'common/icon';
import { TodoStore } from './services/todo';

export * from './services/todo';

const ROOT_FIREBASE_REF: OpaqueToken = new OpaqueToken('RootFirebaseRef');

export const SERVICES_BINDINGS: Array<any> = [
	provide(IconStore, {
		useFactory: (http: Http) => {
			return new IconStore(http);
		},
		deps: [Http] 
	}),
	provide(TodoStore, {
		useFactory: (promise: Promise<Firebase>) => promise.then((ref: Firebase) => new TodoStore(ref)),
		deps: [ROOT_FIREBASE_REF]
	}),
	provide(ROOT_FIREBASE_REF, {
		useFactory: () => {
			let defer: Defer<Firebase> = new Defer();
			var authObservable = AuthenticationObservable.subscribe(setChoresFirebaseRef);
			function setChoresFirebaseRef (auth: FirebaseAuthData, rootFirebaseRef: Firebase) {
				if (auth !== null) {
					authObservable.dispose();
					let choresFirebaseRef: Firebase = rootFirebaseRef.child(`/chores/${auth.uid}`);
					defer.resolve(choresFirebaseRef);
				}
			}
			return defer.promise;
		} 
	})
];