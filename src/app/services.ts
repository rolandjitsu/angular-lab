import { bind, OpaqueToken } from 'angular2/angular2';
import { Http } from 'angular2/http';

import { AuthenticationObservable } from 'common/authentication';
import { Defer } from 'common/async';
import { IconStore } from 'common/icon';
import { TodoStore } from './services/todo';

export * from './services/todo';

const ROOT_FIREBASE_REF: OpaqueToken = new OpaqueToken('RootFirebaseRef');

export const SERVICES_BINDINGS: Array<any> = [
	bind(IconStore).toFactory(
		(http: Http) => {
			return new IconStore(http);
		},
		[Http]
	),
	bind(TodoStore).toFactory((promise: Promise<Firebase>) => promise.then((ref: Firebase) => new TodoStore(ref)), [
		ROOT_FIREBASE_REF
	]),
	bind(ROOT_FIREBASE_REF).toFactory(
		() => {
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
	)
];