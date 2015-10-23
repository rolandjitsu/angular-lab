import { provide, OpaqueToken } from 'angular2/angular2';
import { Http } from 'angular2/http';

import { AuthClient } from './services/auth';
import { Icon } from './services/icon';
import { Chores } from './services/chores';

export * from './services/auth';
export * from './services/icon';
export * from './services/chores';

const ROOT_FIREBASE_REF: Firebase = new Firebase('https://ng2-lab.firebaseio.com');
const TODOS_FIREBASE_REF: OpaqueToken = new OpaqueToken('TodosFirebaseRef');

export const SERVICES_BINDINGS: Array<any> = [
	provide(Icon, {
		useFactory: (http: Http) => {
			return new Icon(http);
		},
		deps: [Http]
	}),
	provide(Chores, {
		useFactory: (promise: Promise<Firebase>) => promise.then((ref: Firebase) => new Chores(ref)),
		deps: [TODOS_FIREBASE_REF]
	}),
	provide(TODOS_FIREBASE_REF, {
		useFactory: (client) => {
			return new Promise((resolve) => {
				// Authenticate firebase and then create the reference based on the uid returned from Firebase after auth
				let unobserve = client.observe((auth: FirebaseAuthData) => {
					if (auth !== null) {
						resolve(ROOT_FIREBASE_REF.child(`/chores/${auth.uid}`));
						unobserve();
					}
				});
			});
		},
		deps: [AuthClient]
	}),
	provide(AuthClient, {
		useFactory: () => {
			return new AuthClient(ROOT_FIREBASE_REF);
		}
	}),
	provide(ROOT_FIREBASE_REF, {
		useExisting: ROOT_FIREBASE_REF
	})
];