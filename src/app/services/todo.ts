import { FirebaseArray, IFirebaseArrayValue, FIREBASE_TIMESTAMP } from 'common/firebase';

export interface ITodo extends IFirebaseArrayValue {
	createdAt: string;
	updatedAt: string;
	completedAt?: string;
	completed: boolean;
	desc: string;
}

class Todo implements ITodo {
	createdAt: string = FIREBASE_TIMESTAMP;
	updatedAt: string = FIREBASE_TIMESTAMP;
	completed: boolean = false;
	desc: string;
	key: string;
	constructor(desc: string) {
		this.desc = desc;
	}
}

export class TodoStore extends FirebaseArray {
	constructor() {
		let root =  new Firebase('https://ng2-play.firebaseio.com');
		let auth = root.getAuth();
		let ref = root.child('/chores/' + auth.uid);
		super(ref);
	}

	add(task: string) {
		return super.add(
			new Todo(task)
		);
	}
	update(record, data) {
		super.update(
			record.key,
			Object.assign({}, record, data, {
				updatedAt: FIREBASE_TIMESTAMP
			})
		);
	}
	remove(record) {
		super.remove(record.key);
	}
}