import { EventEmitter } from 'angular2/angular2';
import { FunctionWrapper, isJsObject } from 'angular2/src/facade/lang';
import { ObservableWrapper } from 'angular2/src/facade/async';
import * as Firebase from 'firebase';


/**
 * Firebase Timestamp
 * It's value, when fetched, is a UTC that is assigned when the data is saved on the Firebase servers
 * (and not when the the user submits the data for save).
 */

export const FIREBASE_TIMESTAMP = Firebase.ServerValue.TIMESTAMP;


/**
 * Firebase array value interface.
 */

export interface IFirebaseArrayValue {
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

let _refs: Map<string, any> = new Map();


/**
 * Expose a singleton like class.
 * Ensures that if the Angular [router]{@link https://github.com/angular/router} is used,
 * or if the same class is instantiated on the same Firebase reference,
 * we only bind to the [query]{@link https://www.firebase.com/docs/web/api/query/on.html} events once per reference (otherwise we end up with multiple callbacks triggered on the same event).
 * Map the reference url to a list and if the url is found, when the class is instantiated,
 * use that list so updates to the same reference reflect across all instances even if events are not bound.
 *
 * @class
 * @name FirebaseArray
 *
 * @param {Firebase} ref - A Firebase referance (created via `let ref = new Firebase('https://<name>.firebaseio.com')`).
 * @param {Function} callback - A function which will be invoked after any synchronization with Firebase.
 * @returns {FirebaseArray}
 *
 * @example
 * class Galaxies extends FirebaseArray {
 *     constructor() {
 *         let ref = let ref = new Firebase('https://<name>.firebaseio.com');
 *         super(ref, (event, key, record) => {
 *             // this gets called for every sync with Firebase
 *         })
 *     }
 * }
 */

export interface IFirebaseArray {
	entries: Array<any>;
	indexOf(key: string): number;
	add(data: any): Firebase;
	set(key: string, data: any): void;
	get(key: string): any;
	update(key: string, data: any): void;
	move(key: string, priority: any): void;
	remove(key: string): void;
	dispose(): void;
}

export class FirebaseArray implements IFirebaseArray {
	public entries: Array<any>;
	private _ref: Firebase;
	private _emitter: EventEmitter = new EventEmitter();
	private _subscription: any;
	private _subs: Array<Array<any>>;

	constructor(ref: Firebase, onEvent?: (eventName: string, key: string, record?: any) => void, onError?: (error: any) => void) {
		let url: string = ref.toString();
		this._subscription = ObservableWrapper.subscribe(
			this._emitter,
			value => FunctionWrapper.apply(onEvent || noop, value),
			err => FunctionWrapper.apply(onError || noop, err)
		);
		this._ref = ref;
		if (_refs.has(url)) this._subs = _refs.get(url)._subs;
		else {
			_refs.set(url, {
				_entries: [],
				_subs: []
			});
			this._subs = _refs.get(url)._subs;
			let events: any = {
				child_added: this._added,
				child_changed: this._changed,
				child_moved: this._moved,
				child_removed: this._removed
			};
			for (let name of Object.keys(events)) this._subs.push([
				name,
				this._ref.on(
					name,
					events[name].bind(this)
				)
			]);
		}
		this.entries = _refs.get(url)._entries;
	}


	/**
	 * A convenience method to find the array position of a given key.
	 *
	 * @name indexOf
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Key (Firebase path) of the record to find in the `entries`.
	 * @returns {Number} Index of the record (`-1` if not found).
	 */

	public indexOf(key: string): number {
		for (let [i, len] = [0, this.entries.length]; i < len; i++) {
			if (this.entries[i].key === key) return i;
		}
		return -1;
	}


	/**
	 * Adds a record to Firebase and returns the reference.
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
	 * @returns {Firebase} A Firebase reference to the data.
	 */

	public add(data: any): Firebase {
		let key: string = this._ref.push().key();
		let ref: Firebase = this._ref.child(key);
		if (arguments.length > 0) ref.set(
			parseForFirebase(data),
			error => error && ObservableWrapper.callThrow(this._emitter, [
				error
			])
		);
		return ref;
	}


	/**
	 * Replaces the value of a record locally and in Firebase.
	 *
	 * @name set
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be replaced.
	 * @param {*} data - Data to add to the array (and sync with Firebase).
	 */

	public set(key: string, data: any): void {
		this._ref.child(key).set(
			parseForFirebase(data),
			error => error && ObservableWrapper.callThrow(this._emitter, [
				error
			])
		);
	}


	/**
	 * Get the value of a record based on it's `key`.
	 *
	 * @name get
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be replaced.
	 * @returns {*} Record.
	 */

	public get(key: string): any {
		let idx = this.indexOf(key);
		if (idx === -1) return null;
		return this.entries[idx];
	}


	/**
	 * Updates the value of a record, replacing any keys that are in data with the values provided and leaving the rest of the record alone.
	 *
	 * @name update
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be udapted.
	 * @param {*} data - Data to merge into the record (and sync with Firebase).
	 */

	public update(key: string, data: any): void {
		this._ref.child(key).update(
			parseForFirebase(data),
			error => error && ObservableWrapper.callThrow(this._emitter, [
				error
			])
		);
	}


	/**
	 * Moves a record locally and in the remote data list.
	 *
	 * @name move
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be moved.
	 * @param {(String|Number)} priority - Sort order to be applied.
	 */

	public move(key: string, priority: any): void {
		this._ref.child(key).setPriority(priority);
	}


	/**
	 * Removes a record locally and from Firebase.
	 *
	 * @name remove
	 * @memberof FirebaseArray
	 *
	 * @param {String} key - Record key to be removed.
	 */

	public remove(key: string): void {
		this._ref.child(key).remove(
			error => error && ObservableWrapper.callThrow(this._emitter, [
				error
			])
		);
	}


	/**
	 * Unsubscribes from all Firebase [events]@{link https://www.firebase.com/docs/web/api/query/on.html} (`child_added`, `child_changed`, `child_moved`, `child_removed`).
	 * This means that the changes will still be pushed to Firebase,
	 * but there will be no callbacks and if data is changed from another client, it will not be reflected on the current client.
	 * It also removes the callback functions added on the class instantiation.
	 * 
	 * @name dispose
	 * @memberof FirebaseArray
	 */

	public dispose(): void {
		ObservableWrapper.dispose(this._subscription);
		let ref: Firebase = this._ref;
		this._subs.forEach((sub) => {
			ref.off(sub[0], sub[1]);
		});
		this._subs = [];
	}

	private _move(key: string, record: any, prevKey?: string): void {
		let pos: number = this._getRecordPos(key, prevKey);
		this.entries.splice(pos, 0, record);
	}
	private _getRecordPos(key: string, prevKey?: string): number {
		if (prevKey === null) return 0;
		else {
			let idx = this.indexOf(prevKey);
			if (idx === -1) return this.entries.length;
			else return idx + 1;
		}
	}


	private _added(snapshot: FirebaseDataSnapshot, prevKey?: string): void {
		let key: string = snapshot.key();
		let record = parseVal(
			key,
			snapshot.val()
		);
		this._move(key, record, prevKey);
		ObservableWrapper.callNext(this._emitter, [
			'child_added',
			key,
			record
		]);
	}
	private _moved(snapshot: FirebaseDataSnapshot, prevKey?: string): void {
		let key: string = snapshot.key();
		let oldPos: number = this.indexOf(key);
		if (oldPos !== -1) {
			let record: any = this.entries[oldPos];
			this.entries.splice(oldPos, 1);
			this._move(key, record, prevKey);
			ObservableWrapper.callNext(this._emitter, [
				'child_moved',
				key,
				record
			]);
		}
	}
	private _changed(snapshot: FirebaseDataSnapshot): void {
		let key: string = snapshot.key();
		let pos: number = this.indexOf(key);
		if (pos !== -1) {
			this.entries[pos] = applyToBase(
				this.entries[pos],
				parseVal(
					key,
					snapshot.val()
				)
			);
			ObservableWrapper.callNext(this._emitter, [
				'child_changed',
				key,
				this.entries[pos]
			]);
		}
	}
	private _removed(snapshot: FirebaseDataSnapshot): void {
		let key: string = snapshot.key();
		let pos: number = this.indexOf(key);
		if (pos !== -1) {
			this.entries.splice(pos, 1);
			ObservableWrapper.callNext(this._emitter, [
				'child_removed',
				key
			]);
		}
	}
}

function applyToBase (base: any, data: any): any {
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

function parseForFirebase (data: any): any {
	if (data && isJsObject(data)) {
		delete data.key;
		if (data.hasOwnProperty('value')) data = data.value;
	}
	if (data === undefined) data = null;
	return data;
}

function parseVal (key: string, data: any): any {
	if (!isJsObject(data) || !data) data = { value: data };
	data.key = key;
	return data;
}

function noop () {}