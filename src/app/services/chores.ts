import {FirebaseArray, FirebaseArrayValue} from '../../common/firebase_array';

export interface Chore extends FirebaseArrayValue {
	createdAt: number | string;
	updatedAt: number | string;
	completed: boolean;
	name: string;
}

export class Chores extends FirebaseArray {
	add(name: string): Promise<Firebase> {
		return super.add(<Chore>{
			createdAt: Firebase.ServerValue.TIMESTAMP,
			updatedAt: Firebase.ServerValue.TIMESTAMP,
			completed: false,
			name: name
		});
	}
	update(record, data: Chore): Promise<Firebase> {
		return super.update(
			record.key,
			Object.assign({}, record, data, {
				updatedAt: Firebase.ServerValue.TIMESTAMP
			})
		);
	}
	remove(record): Promise<any> {
		return super.remove(record.key);
	}
}