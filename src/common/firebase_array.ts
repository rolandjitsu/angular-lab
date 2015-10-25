/**
 * Firebase array value interface.
 */

export interface FirebaseArrayValue {
	key: string;
	value?: any;
}


/**
 * Firebase references.
 * It will store all instances of FirebaseArray so that, when an instance with the same reference is to be created,
 * it will use the stored instance instead of creating a new one.
 *
 * @private
 */

let _refs: Map<any, any> = new Map();


/**
 * Expose a singleton like class.
 * Ensures that if the same class is instantiated on the same Firebase reference,
 * we only bind to the [query]{@link https://www.firebase.com/docs/web/api/query/on.html} events once per reference (otherwise we end up with multiple callbacks triggered on the same event).
 * Map the reference url to a list and if the url is found, when the class is instantiated,
 * use that list so updates to the same reference reflect across all instances even if events are not bound.
 *
 * @class
 * @name FirebaseArray
 *
 * @param {Firebase} ref - A Firebase reference (created via `let ref = new Firebase('https://<name>.firebaseio.com')`).
 *
 * @example
 * let ref = new Firebase('https://<name>.firebaseio.com');
 * class Galaxies extends FirebaseArray {
 *     constructor() {
 *         super(ref);
 *     }
 * }
 * // or let fa = new FirebaseArray(ref);
 */

export class FirebaseArray extends Array {
	ref: Firebase;
	private _subs: Array<Array<any>>;

	constructor(ref: Firebase) {
		let url: string = ref.toString();
		this.ref = ref;
		if (_refs.has(url)) this._subs = _refs.get(url)._subs;
		else {
			_refs.set(url, {
				entries: [],
				_subs: []
			});
			this._subs = _refs.get(url)._subs;
			let events: any = {
				child_added: this._onAdded,
				child_changed: this._onChanged,
				child_moved: this._onMoved,
				child_removed: this._onRemoved
			};
			for (let name of Object.keys(events)) this._subs.push([
				name,
				this.ref.on(
					name,
					events[name].bind(this)
				)
			]);
		}
		let entries = _refs.get(url).entries;
		super(entries.length);
		for (let [entry, idx] of entries) {
			this[idx] = entry;
		}
	}


	/**
	 * Adds a record to Firebase and returns the reference in a promise.
	 * To obtain its key, use `ref.key()`, assuming `ref` is the variable assigned to the return value.
	 *
	 * Note that all the records stored in the array are objects.
	 * Primitive values get stored as `{ value: primitive }`.
	 * Moreover, each record will get a new property `key` which is used to do changes to the record (most methods require the `key`).
	 *
	 * @name add
	 * @memberof FirebaseArray
	 *
	 * @param {*} data - Data to add to the array (and sync with Firebase).
	 * @returns {Promise<Firebase>} A promise with a Firebase reference to the data.
	 */

	add(data: any): Promise<Firebase> {
		return new Promise((resolve, reject) => {
			let key: string = this.ref.push().key();
			let ref: Firebase = this.ref.child(key);
			ref.set(transformDataToFirebaseArrayValue(data), (error) => {
				if (error) reject(error);
				else resolve(ref);
			});
		});
	}


	/**
	 * Replaces the value of a record locally and in Firebase.
	 *
	 * @name set
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be replaced.
	 * @param {*} data - Data to add to the array (and sync with Firebase).
	 * @returns {Promise<Firebase>} A promise with a Firebase reference to the data.
	 */

	set(key: string, data: any): Promise<Firebase> {
		return new Promise((resolve, reject) => {
			if (!keyExists(key)) return reject();
			let ref: Firebase = this.ref.child(key);
			ref.set(transformDataToFirebaseArrayValue(data), (error) => {
				if (error) reject(error);
				else resolve(ref);
			});
		});
	}


	/**
	 * Get the value of a record based on it's `key`.
	 *
	 * @name get
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be replaced.
	 * @returns {Promise} A promise with the record for the `key`.
	 */

	get(key: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!keyExists(key)) reject();
			else this.ref.child(key).once('value', (snapshot) => resolve(snapshot.val()), (error) => reject(error));
		});
	}


	/**
	 * Updates the value of a record, replacing any keys that are in data with the values provided and leaving the rest of the record alone.
	 *
	 * @name update
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be udapted.
	 * @param {*} data - Data to merge into the record (and sync with Firebase).
	 * @returns {Promise<Firebase>} A promise with a Firebase reference to the data.
	 */

	update(key: string, data: any): Promise<Firebase> {
		return new Promise((resolve, reject) => {
			if (!keyExists(key)) return reject();
			let ref: Firebase = this.ref.child(key);
			ref.update(transformDataToFirebaseArrayValue(data), (error) => {
				if (error) reject(error);
				else resolve(ref);
			});
		});
	}


	/**
	 * Moves a record locally and in the remote data list.
	 *
	 * @name move
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be moved.
	 * @param {(String|Number)} priority - Sort order to be applied.
	 * @returns {Promise<Firebase>} A promise with a Firebase reference to the data.
	 */

	move(key: string, priority: any): Promise<Firebase> {
		return new Promise((resolve, reject) => {
			/* tslint:disable */
			if (!keyExists(key) || isPriorityValid(priority)) return reject();
			/* tslint:enable */
			let ref: Firebase = this.ref.child(key);
			ref.setPriority(priority, (error) => {
				if (error) reject(error);
				else resolve(ref);
			});
		});
	}


	/**
	 * Removes a record locally and from Firebase.
	 *
	 * @name remove
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be removed.
	 * @returns {Promise}
	 */

	remove(key: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!keyExists(key)) return reject();
			this.ref.child(key).remove((error) => {
				if (error) reject(error);
				else resolve();
			});
		});
	}


	/**
	 * Observe the Firebase reference for data changes.
	 *
	 * @name observe
	 * @memberof FirebaseArray
	 *
	 * @param {Function} callback
	 * @returns {Function} Use to unobserve.
	 */

	observe(callback: (snapshot?: FirebaseDataSnapshot) => void): Function {
		this.ref.on('value', callback);
		return () => {
			this.ref.off('value', callback);
		};
	}


	/**
	 * Unsubscribes from all Firebase [events]@{link https://www.firebase.com/docs/web/api/query/on.html} (`child_added`, `child_changed`, `child_moved`, `child_removed`).
	 * This means that the changes will still be pushed to Firebase,
	 * but there will be no callbacks and if data is changed from another client, it will not be reflected on the current client.
	 *
	 * @name dispose
	 * @memberof FirebaseArray
	 */

	dispose(): void {
		this._subs.forEach((sub) => {
			this.ref.off(sub[0], sub[1]);
		});
		this._subs = [];
	}


	private _onAdded(snapshot: FirebaseDataSnapshot, prevKey?: string): void {
		let key: string = snapshot.key();
		let record = parseFirebaseArrayValue(key, snapshot.val());
		this._move(key, record, prevKey);
	}
	private _onChanged(snapshot: FirebaseDataSnapshot): void {
		let key: string = snapshot.key();
		let pos: number = this._indexOfKey(key);
		if (pos !== -1) this[pos] = extendFirebaseArrayValue(this[pos], parseFirebaseArrayValue(key, snapshot.val()));
	}
	private _onMoved(snapshot: FirebaseDataSnapshot, prevKey?: string): void {
		let key: string = snapshot.key();
		let oldPos: number = this._indexOfKey(key);
		if (oldPos !== -1) {
			let record: any = this[oldPos];
			this.splice(oldPos, 1);
			this._move(key, record, prevKey);
		}
	}
	private _onRemoved(snapshot: FirebaseDataSnapshot): void {
		let pos: number = this._indexOfKey(snapshot.key());
		if (pos !== -1) this.splice(pos, 1);
	}


	private _indexOfKey(key: string): number {
		for (let [i, len] = [0, this.length]; i < len; i++) {
			if (this[i].key === key) return i;
		}
		return -1;
	}
	private _move(key: string, record: any, prevKey?: string): void {
		this.splice(this._getRecordPos(key, prevKey), 0, record);
	}
	private _getRecordPos(key: string, prevKey?: string): number {
		if (prevKey === null) return 0;
		else {
			let idx = this._indexOfKey(prevKey);
			if (idx === -1) return this.length;
			else return idx + 1;
		}
	}
}


function keyExists (key: any) {
	return typeof key === 'string';
}

function isPriorityValid (priority: any) {
	return typeof priority === 'string' || (!Number.isNaN(parseFloat(priority)) && Number.isFinite(priority));
}

function isJsObject (obj: any) {
	return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}

function extendFirebaseArrayValue (base: any, data: any): any {
	if (!isJsObject(base) || !isJsObject(data)) return data;
	else {
		let key: string;
		for (key in base) {
			if (key !== 'key' && base.hasOwnProperty(key) && !data.hasOwnProperty(key)) delete base[key];
		}
		for (key in data) {
			if (data.hasOwnProperty(key)) base[key] = data[key];
		}
		return base;
	}
}

function transformDataToFirebaseArrayValue (data: any): any {
	if (data && isJsObject(data)) {
		delete data.key;
		if (data.hasOwnProperty('value')) data = data.value;
	}
	if (data === undefined) data = null;
	return data;
}

function parseFirebaseArrayValue (key: string, data: any): any {
	if (!isJsObject(data) || !data) data = { value: data };
	data.key = key;
	return data;
}