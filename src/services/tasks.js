import { FirebaseArray, FIREBASE_TIMESTAMP } from 'services/firebase';

export class Tasks extends FirebaseArray {
	constructor() {
		let ref =  new Firebase('https://ng2-play.firebaseio.com/chores');
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


// TODO: remove bellow
export class Tests extends FirebaseArray {
	constructor() {
		let ref =  new Firebase('https://ng2-play.firebaseio.com/chores');
		super(ref);
	}
}