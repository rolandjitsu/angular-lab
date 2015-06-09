import { FirebaseArray, FIREBASE_TIMESTAMP } from './firebase';

export class Todo extends FirebaseArray {
	constructor() {
		let root =  new Firebase('https://ng2-play.firebaseio.com');
		let auth = root.getAuth();
		let ref = root.child('/chores/' + auth.uid);
		super(ref);
	}

	add(task) {
		return super.add({
			created: FIREBASE_TIMESTAMP,
			updated: FIREBASE_TIMESTAMP,
			desc: task,
			completed: false
		});
	}
	update(record, data) {
		super.update(
			record.key,
			Object.assign({}, record, data, {
				updated: FIREBASE_TIMESTAMP
			})
		);
	}
}