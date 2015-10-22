import { isString, isNumber } from '../../common/lang';
import { FirebaseArray, FirebaseArrayValue } from '../../common/firebase_array';

export interface Chore extends FirebaseArrayValue {
	createdAt: number | string;
	updatedAt: number | string;
	completed: boolean;
	desc: string;
}

export class ChoreModel implements Chore {
	createdAt: number | string = Firebase.ServerValue.TIMESTAMP;
	updatedAt: number | string = Firebase.ServerValue.TIMESTAMP;
	completed: boolean = false;
	desc: string;
	key: string;
	constructor(desc?: string, completed?: boolean, key?: string, createdAt?: number | string, updatedAt?: number | string) {
		if (isString(desc)) this.desc = desc;
		if (completed !== undefined) this.completed = completed;
		if (isString(key)) this.key = key;
		if (isNumber(createdAt)) this.createdAt = createdAt;
		if (isNumber(updatedAt)) this.updatedAt = updatedAt;
	}
	static fromModel(model: Chore): ChoreModel {
		return new ChoreModel(model.desc, model.completed, model.key, model.createdAt, model.updatedAt);
	}
	static assign(model: Chore, ...sources: Chore[]): ChoreModel {
		return ChoreModel.fromModel(
			Object.assign.apply(null, [].concat([model], sources))
		);
	}
}

export class Chores extends FirebaseArray {
	add(chore: Chore): Promise<Firebase> {
		return super.add(chore);
	}
	update(record, data: Chore): Promise<Firebase> {
		return super.update(
			record.key,
			ChoreModel.assign(<Chore>{}, record, data, <Chore>{
				updatedAt: Firebase.ServerValue.TIMESTAMP
			})
		);
	}
	remove(record): Promise<any> {
		return super.remove(record.key);
	}
}