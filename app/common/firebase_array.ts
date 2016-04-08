import {isJsObject} from './lang';


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

export class FirebaseArray {
	ref: Firebase;

	get length() {
		return this._items.length;
	}

	private _subs: Array<any>[];
	private _items = [];

	constructor(ref: Firebase) {
		let url: string = ref.toString();
		this.ref = ref;
		if (_refs.has(url)) {
			this._subs = _refs.get(url)._subs;
		} else {
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
			for (let [name, event] of (<any>Object).entries(events)) {
				this._subs.push([
					name,
					this.ref.on(name, (...args) => Reflect.apply(event, this, args))
				]);
			}
		}
		let entries = _refs.get(url).entries;
		if (!entries.length) {
			this._items = new Array(entries.length);
			for (let [entry, idx] of entries) {
				this._items[idx] = entry;
			}
		}
	}

	[Symbol.iterator]() {
		return this._items.values();
	}


	// TODO
	// On instance create, we need to check if the Firebase `ref` exists and if it is compatible with an FirebaseArray;
	// Implement remaining Array [methods]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array}.
	// Keep in mind that for methods like `.every()`, if a primitive is passed,
	// we need to check the `.value` because we store primitives as `{ value: <primitive>, key: <string> }`.
	// Alternatively, we need to figure out what to do when similar methods are called on the array, perhaps just documenting that primitive values are not stored as primitives.
	// The same thing applies for `.filter()`, `.find()`, `.findIndex()`, `.forEach()`, `.map()`, `.reduce()`,
	// `.reduceRight()`, `.some()`.
	// Whereas methods like `.includes()`, `.indexOf()`, `.lastIndexOf()` just need to check if it is a primitive and if so check the `.value` is the value searched for.
	// FirebaseArray.from
	// FirebaseArray.of
	// FirebaseArray.observe
	// FirebaseArray.prototype.concat - decide if it should return an instance of `Array` or `FirebaseArray`,
	// and if the former happens, we need to make sure if there are primitives, we return those instead of objects.
	// Same with `.slice()`, `.copyWithin()`.
	// FirebaseArray.prototype.fill
	// FirebaseArray.prototype.join - need to decide what to do with this
	// FirebaseArray.prototype.pop - if last element is a primitive we need to return that instead of the object we have stored
	// FirebaseArray.prototype.push - we already have this in place (`.add()`)
	// FirebaseArray.prototype.reverse
	// FirebaseArray.prototype.shift - same as `.pop()`
	// FirebaseArray.prototype.sort
	// FirebaseArray.prototype.splice
	// FirebaseArray.prototype.unshift
	// [Symbol.iterator]() - maybe this can solve our primitive issue


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
				if (error) {
					reject(error);
				} else {
					resolve(ref);
				}
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
			if (!keyExists(key)) {
				return reject();
			}
			let ref: Firebase = this.ref.child(key);
			ref.set(transformDataToFirebaseArrayValue(data), (error) => {
				if (error) {
					reject(error);
				} else {
					resolve(ref);
				}
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
			if (keyExists(key)) {
				this.ref.child(key).once('value', (snapshot) => resolve(snapshot.val()), (error) => reject(error));
			} else {
				reject();
			}
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
			if (!keyExists(key)) {
				return reject();
			}
			let ref: Firebase = this.ref.child(key);
			ref.update(transformDataToFirebaseArrayValue(data), (error) => {
				if (error) {
					reject(error);
				} else {
					resolve(ref);
				}
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
			if (isPriorityValid(priority) || !keyExists(key)) {
				return reject();
			}
			let ref: Firebase = this.ref.child(key);
			ref.setPriority(priority, (error) => {
				if (error) {
					reject(error);
				} else {
					resolve(ref);
				}
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
			if (!keyExists(key)) {
				return reject();
			}
			this.ref.child(key).remove((error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
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
		if (pos !== -1) {
			this._items[pos] = extendFirebaseArrayValue(this._items[pos], parseFirebaseArrayValue(key, snapshot.val()));
		}
	}
	private _onMoved(snapshot: FirebaseDataSnapshot, prevKey?: string): void {
		let key: string = snapshot.key();
		let oldPos: number = this._indexOfKey(key);
		if (oldPos !== -1) {
			let record: any = this._items[oldPos];
			this._items.splice(oldPos, 1);
			this._move(key, record, prevKey);
		}
	}
	private _onRemoved(snapshot: FirebaseDataSnapshot): void {
		let pos: number = this._indexOfKey(snapshot.key());
		if (pos !== -1) {
			this._items.splice(pos, 1);
		}
	}


	private _indexOfKey(key: string): number {
		for (let [i, item] of this._items.entries()) {
			if (item.key === key) {
				return i;
			}
		}
		return -1;
	}
	private _move(key: string, record: any, prevKey?: string): void {
		this._items.splice(this._getRecordPos(key, prevKey), 0, record);
	}
	private _getRecordPos(key: string, prevKey?: string): number {
		if (prevKey === null) {
			return 0;
		} else {
			let idx = this._indexOfKey(prevKey);
			if (idx === -1) {
				return this._items.length;
			} else {
				return idx + 1;
			}
		}
	}
}


function keyExists (key: any) {
	return typeof key === 'string';
}

function isPriorityValid (priority: any) {
	return typeof priority === 'string' || (!Number.isNaN(parseFloat(priority)) && Number.isFinite(priority));
}

function extendFirebaseArrayValue (base: any, data: any): any {
	if (!isJsObject(base) || !isJsObject(data)) {
		return data;
	} else {
		let key: string;
		for (key in base) {
			if (key !== 'key' && base.hasOwnProperty(key) && !data.hasOwnProperty(key)) {
				delete base[key];
			}
		}
		for (key in data) {
			if (data.hasOwnProperty(key)) {
				base[key] = data[key];
			}
		}
		return base;
	}
}

function transformDataToFirebaseArrayValue (data: any): any {
	if (data && isJsObject(data)) {
		delete data.key;
		if (data.hasOwnProperty('value')) {
			data = data.value;
		}
	}

	if (data === undefined) {
		data = null;
	}

	return data;
}

function parseFirebaseArrayValue (key: string, data: any): any {
	if (!isJsObject(data) || !data) {
		data = {value: data};
	}

	data.key = key;

	return data;
}
