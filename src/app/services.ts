import {provide} from 'angular2/core';
import {Http} from 'angular2/http';

import {AuthClient} from './services/auth';
import {Chores} from './services/chores';
import {FIREBASE_APP_LINK, FIREBASE_CHORES_PATH} from './services/firebase';
import {Icon} from './services/icon';
import {User} from './services/user';

export * from './services/auth';
export * from './services/chores';
export * from './services/firebase';
export * from './services/icon';
export * from './services/user';

export const SERVICES_PROVIDERS: Array<any> = [
	provide(Chores, {
		useFactory: (promise: Promise<User>) => {
			return new Promise((resolve) => {
				return promise.then((user: User) => resolve(
					new Chores(
						new Firebase(`${FIREBASE_APP_LINK}/${FIREBASE_CHORES_PATH}/${user.uid}`)
					)
				));
			});
		},
		deps: [
			User
		]
	}),
	provide(User, {
		useFactory: (client: AuthClient) => {
			// Authenticate Firebase and then create/get the user based on the uid/email returned from Firebase after auth
			return new Promise((resolve) => {
				let subscription = client.session.subscribe((auth: FirebaseAuthData) => {
					if (auth !== null) {
						let up = User.fromAuth(auth);
						up.then((user: User) => {
							subscription.unsubscribe();
							resolve(user);
						});
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
			return new AuthClient();
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