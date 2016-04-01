import * as Firebase from '../common/constants';
import {FirebaseArray} from '../common/firebase_array';
import {FirebaseQueryEvent, FirebaseQueryEventType, FirebaseQueryObservable} from '../common/firebase_query_observable';

import {FIREBASE_APP_LINK, FIREBASE_USERS_PATH} from './../common/constants';


export interface UserQueryOpts {
	by: {
		email?: string;
		key?: string
	};
}

// Create a users array.
// On creating a new user get all users by email.
// If a user exists, use that user, populate the values on the class and send the changes to the subscribers.
// If no user exists we create one by pushing to the array of users
// and on done we proceed with the same action as before.
export class User {
	email: string; // auth.<provider>.email
	providers: string[]; // all auth.provider used by the user to authenticate
	key: string; // the key for the user from the array of users
	changes: FirebaseQueryObservable;

	constructor(attrs: {
		email: string,
		providers: string[],
		key: string
	}) {
		this.email = attrs.email;
		this.providers = attrs.providers;
		this.key = attrs.key;
		let firebaseUsersRef = new Firebase(`${FIREBASE_APP_LINK}/${FIREBASE_USERS_PATH}`);
		this.changes = new FirebaseQueryObservable(firebaseUsersRef.child(attrs.key), [
			FirebaseQueryEventType.Value
		]);
	}

	static fromAuth(auth: FirebaseAuthData): Promise<User> {
		let email: string = auth[auth.provider].email;
		let firebaseUsersRef = new Firebase(`${FIREBASE_APP_LINK}/${FIREBASE_USERS_PATH}`);
		let usersArray = new FirebaseArray(firebaseUsersRef);
		let query = User.query({by: {email}});
		return new Promise((resolve) => {
			query.then((users: Map<string, any>) => {
				if (users.size) {
					// Found the user.
					// Check if providers contains the current `auth.provider` and update the user providers if it does not contain it.
					let {key, providers} = Array.from(users.values())[0];
					if (Array.isArray(providers) && providers.includes(auth.provider)) {
						resolve(new User({key, email, providers}));
					} else {
						let firebaseUserProvidersRef = firebaseUsersRef.child(key).child('providers');
						let observable = new FirebaseQueryObservable(firebaseUserProvidersRef, [
							FirebaseQueryEventType.Value
						]);
						let first = true;
						let subscription = observable.subscribe((event: FirebaseQueryEvent) => {
							if (first) {
								first = false;
							} else {
								let user = new User({key, email, providers: event.data.val()});
								subscription.unsubscribe();
								resolve(user);
							}
						});
						firebaseUserProvidersRef.set(
							Array.isArray(providers)
								? providers.concat([auth.provider])
								: [auth.provider]
						);
					}
				} else {
					// Could not find the user.
					// If no user could be found we need to create one.
					// After user is saved, resolve the promise with the newly created user.
					let providers = [auth.provider];
					usersArray.add({email, providers}).then((ref: Firebase) => {
						let key = ref.key();
						let firebaseUserKeyRef = ref.child('key');
						let observable = new FirebaseQueryObservable(firebaseUserKeyRef, [
							FirebaseQueryEventType.Value
						]);
						let first = true;
						let subscription = observable.subscribe(() => {
							if (first) {
								first = false;
							} else {
								let user = new User({email, providers, key});
								subscription.unsubscribe();
								resolve(user);
							}
						});
						firebaseUserKeyRef.set(key);
					});
				}
			});
		});
	}

	static query(opts: UserQueryOpts): Promise<Map<string, any>> {
		let searchOps = Object.keys(opts.by);
		let firebaseUsersRef = new Firebase(`${FIREBASE_APP_LINK}/${FIREBASE_USERS_PATH}`);
		let queue: Promise<any>[] = [];
		for (let option of searchOps) {
			let subscriber = (child) => {
				let queryRef = firebaseUsersRef.orderByChild(child).equalTo(opts.by[child]);
				return (resolve) => {
					let observable = new FirebaseQueryObservable(queryRef, [
						FirebaseQueryEventType.Value
					]);
					let subscription = observable.subscribe((event: FirebaseQueryEvent) => {
						if (event.data.exists()) {
							resolve(event.data.val());
						} else {
							resolve(null);
						}
						subscription.unsubscribe();
					});
				};
			};
			queue.push(
				new Promise(subscriber(option))
			);
		}
		return Promise.all(queue).then((results) => {
			let users = new Map();
			results = results.filter((result) => result !== null);
			for (let result of results) {
				let keys = Object.keys(result);
				for (let key of keys) {
					if (!users.has(key)) users.set(key, result[key]);
				}
			}
			return users;
		});
	}
}
