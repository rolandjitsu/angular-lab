import { FirebaseArray } from '../../common/firebase_array';
import { FirebaseEvent, FirebaseEventType, FirebaseObservable } from '../../common/firebase_observable';

import { FIREBASE_APP_LINK, FIREBASE_USERS_PATH } from './firebase';


export interface UserQueryOpts {
	by: {
		email?: string;
		uid?: string
	};
}

// Create a users array.
// On creating a new user get all users by email.
// If a user exists, use that user, populate the values on the class and send the changes to the subscribers.
// If no user exists we create one by pushing to the array of users
// and on done we proceed with the same action as before.
export class User {
	uid: string; // the key for the user from the array of users
	email: string; // auth.<provider>.email
	providers: string[]; // all auth.provider used by the user to authenticate
	changes: FirebaseObservable;

	constructor(attrs: {
		uid: string,
		email: string,
		providers: string[]
	}) {
		this.uid = attrs.uid;
		this.email = attrs.email;
		this.providers = attrs.providers;
		let firebaseUsersRef = new Firebase(`${FIREBASE_APP_LINK}/${FIREBASE_USERS_PATH}`);
		this.changes = new FirebaseObservable(firebaseUsersRef.child(attrs.uid), [
			FirebaseEventType.Value
		]);
	}

	static fromAuth(auth: FirebaseAuthData): Promise<User> {
		let email: string = auth[auth.provider].email;
		let firebaseUsersRef = new Firebase(`${FIREBASE_APP_LINK}/${FIREBASE_USERS_PATH}`);
		let usersArray = new FirebaseArray(firebaseUsersRef);
		console.log(auth, email);
		let query = User.query({ by: { email }});
		return new Promise((resolve) => {
			query.then((users: Map<string, any>) => {
				console.log(users);
				if (users.size) {
					// Found the user.
					// Check if providers contains the current `auth.provider` and update the user providers if it does not contain it.
					let { uid, providers } = Array.from(users.values())[0];
					console.log(providers);
					if (Array.isArray(providers) && providers.includes(auth.provider)) resolve(
						new User({ uid, email, providers })
					);
					else {
						let firebaseUserProvidersRef = firebaseUsersRef.child(uid).child('providers');
						let observable = new FirebaseObservable(firebaseUserProvidersRef, [
							FirebaseEventType.Value
						]);
						let first = true;
						let subscription = observable.subscribe((event: FirebaseEvent) => {
							if (first) first = false;
							else {
								let user = new User({ uid, email, providers: event.data.val() });
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
					usersArray.add({ email, providers }).then((ref: Firebase) => {
						let uid = ref.key();
						let firebaseUserUidRef = ref.child('uid');
						let observable = new FirebaseObservable(firebaseUserUidRef, [
							FirebaseEventType.Value
						]);
						let first = true;
						let subscription = observable.subscribe(() => {
							if (first) first = false;
							else {
								let user = new User({ email, providers, uid });
								subscription.unsubscribe();
								resolve(user);
							}
						});
						firebaseUserUidRef.set(uid);
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
					let observable = new FirebaseObservable(queryRef, [
						FirebaseEventType.Value
					]);
					let subscription = observable.subscribe((event: FirebaseEvent) => {
						if (event.data.exists()) resolve(event.data.val());
						else resolve(null);
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