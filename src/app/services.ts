import { provide, OpaqueToken } from 'angular2/angular2';
import { Http } from 'angular2/http';

import { AuthClient } from './services/auth';
import { Icon } from './services/icon';
import { Todos } from './services/todos';

export * from './services/auth';
export * from './services/icon';
export * from './services/todos';

const ROOT_FIREBASE_REF: Firebase = new Firebase('https://ng2-lab.firebaseio.com');
const TODOS_FIREBASE_REF: OpaqueToken = new OpaqueToken('TodosFirebaseRef');
let resolvedTodosFirebaseRef;

export const SERVICES_BINDINGS: Array<any> = [
	provide(Icon, {
		useFactory: (http: Http) => {
			return new Icon(http);
		},
		deps: [Http] 
	}),
	provide(Todos, {
		useFactory: (promise: Promise<Firebase>) => promise.then((ref: Firebase) => new Todos(ref)),
		deps: [TODOS_FIREBASE_REF]
	}),
	provide(TODOS_FIREBASE_REF, {
		useFactory: (client) => {
			return new Promise((resolve) => {
				if (resolvedTodosFirebaseRef) resolve(resolvedTodosFirebaseRef);
				// Authenticate firebase and then create the reference based on the uid returned from Firebase after auth
				let unobserve = client.observe((auth: FirebaseAuthData) => {
					if (auth !== null) {
						resolve(resolvedTodosFirebaseRef = ROOT_FIREBASE_REF.child(`/chores/${auth.uid}`));
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