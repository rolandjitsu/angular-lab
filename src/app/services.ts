import { bind } from 'angular2/angular2';

import { Defer } from 'common/defer';
import { IconStore } from 'common/icon';
import { TodoStore } from './services/todo';

export * from 'common/icon';
export * from './services/todo';

let root: Firebase =  new Firebase('https://ng2-play.firebaseio.com');
let firebaseRef = {};

export const serviceInjectables: Array<any> = [
	bind(TodoStore).toFactory((promise: Promise<Firebase>) => promise.then((ref: Firebase) => new TodoStore(ref)), [firebaseRef]),
	bind(firebaseRef).toFactory(
		() => {
			let defer: Defer<Firebase> = new Defer();
			let authHandler = (auth: FirebaseAuthData) => {
				if (auth !== null) {
					root.offAuth(authHandler);
					let ref: Firebase = root.child('/chores/' + auth.uid);
					defer.resolve(ref);
				}
			};
			root.onAuth(authHandler);
			return defer.promise;
		}
	),
	bind(IconStore).toClass(IconStore)
];