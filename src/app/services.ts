import { provide, OpaqueToken } from 'angular2/angular2';
import { Http } from 'angular2/http';

import { Animation } from '../common/animation';

import { AuthClient } from './services/auth';
import { Chores } from './services/chores';
import { Icon } from './services/icon';

export * from './services/auth';
export * from './services/chores';
export * from './services/icon';

const FIREBASE_APP_LINK: string = 'https://ng2-lab.firebaseio.com';
const TODOS_FIREBASE_REF: OpaqueToken = new OpaqueToken('TodosFirebaseRef');

export const SERVICES_PROVIDERS: Array<any> = [
	provide(Chores, {
		useFactory: (promise: Promise<Firebase>) => promise.then((ref: Firebase) => new Chores(ref)),
		deps: [
			TODOS_FIREBASE_REF
		]
	}),
	provide(TODOS_FIREBASE_REF, {
		useFactory: (client) => {
			return new Promise((resolve) => {
				// Authenticate firebase and then create the reference based on the uid returned from Firebase after auth
				let unobserve = client.observe((auth: FirebaseAuthData) => {
					if (auth !== null) {
						resolve(
							new Firebase(`${FIREBASE_APP_LINK}/chores/${auth.uid}`)
						);
						Animation.rAF(() => unobserve());
					}
				});
			});
		},
		deps: [
			AuthClient
		]
	}),
	provide(AuthClient, {
		useFactory: () => {
			return new AuthClient(
				new Firebase(FIREBASE_APP_LINK)
			);
		}
	}),
	provide(Icon, {
		useFactory: (http: Http) => {
			return new Icon(http);
		},
		deps: [
			Http
		]
	})
];