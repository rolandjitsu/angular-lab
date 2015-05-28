export class TasksStore {
	constructor () {
		this.tasks = [];
	}
}

export class Chores {
	_store: TasksStore;
	constructor(store: TasksStore) {
		this._store = store;
	}
	add(task: string): void {
		this._store.tasks.push({
			value: task,
			timestamp: Date.now()
		});
	}
	remove(idx: number): void {
		this._store.tasks.splice(idx, 1);
	}
	get checklist(): array {
		return this._store.tasks;
	}
}