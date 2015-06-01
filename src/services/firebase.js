export const FIREBASE_TIMESTAMP = Firebase.ServerValue.TIMESTAMP;


/**
 * Expose a singleton like class.
 * Ensures that if the Angular [router]{@link https://github.com/angular/router} is used,
 * or if the same class is instantiated on the same Firebase reference,
 * we only bind to the [query]{@link https://www.firebase.com/docs/web/api/query/on.html} events once per reference (otherwise we end up with multiple callbacks triggered on the same event).
 * Map the reference url to a list and if the url is found, when the class is instantiated,
 * use that list so updates to the same reference reflect across all instances even if events are not bound.
 */

let refs = new Map();

export class FirebaseArray {
	constructor(ref) {
		let url = ref.toString();
		this._ref = ref;
		if (!refs.has(url)) {
			let events = new Map([
				['child_added', this._added],
				['child_changed', this._changed],
				['child_moved', this._moved],
				['child_removed', this._removed]
			]);
			refs.set(url, new Map());
			for (let [event, handler] of events) this._ref.on(
				event,
				handler.bind(this),
				this.error
			);
		}
		this._map = refs.get(url);
	}

	get list() {
		return Array.from(this._map, entry => entry[1]);
	}

	add(record) {
		return new Promise((resolve, reject) => {
			this._ref.push(record, error => {
				if (error) reject(error);
				else resolve();
			})
		});
	}
	update(record, value) {
		let child = this._getChild(record);
		return new Promise((resolve, reject) => {
			if (!child) reject();
			else child.update(value, error => {
				if (error) reject(error);
				else resolve();
			});
		});
	}
	remove(record) {
		let child = this._getChild(record);
		return new Promise((resolve, reject) => {
			if (!child) reject();
			else child.remove(error => {
				if (error) reject(error);
				else resolve();
			});
		});
	}

	_key(record) {
		let entries = this._map.entries();
		for (let entry of entries) {
			if (entry[1] === record) return entry[0];
		}
	}
	_getChild(record) {
		let key = this._key(record);
		if (!key) return null;
		return this._ref.child(key);
	}

	_added(snapshot) {
		this._map.set(
			snapshot.key(),
			snapshot.val()
		);
	}
	_changed(snapshot) {
		this._added(snapshot);
	}
	_moved(snapshot) {}
	_removed(snapshot) {
		this._map.delete(
			snapshot.key()
		);
	}
}