interface ObjectConstructor {
	observe(target: any, callback: Function, acceptList?: Array<any>): void;
	assign(target: any, ...sources: any[]): any
}

interface IteratorResult<T> {
	done: boolean;
	value?: T;
}

interface Iterator<T> {
	next(value?: any): IteratorResult<T>;
	return?(value?: any): IteratorResult<T>;
	throw?(e?: any): IteratorResult<T>;
}

interface Iterable<T> {
	[Symbol.iterator](): Iterator<T>;
}

interface IterableIterator<T> extends Iterator<T> {
	[Symbol.iterator](): IterableIterator<T>;
}

interface Symbol {
	toString(): string;
	valueOf(): Object;
	[Symbol.toStringTag]: string;
}
interface SymbolConstructor {
	prototype: Symbol;
	(description?: string|number): symbol;
	for(key: string): symbol;
	keyFor(sym: symbol): string;
	hasInstance: symbol;
	isConcatSpreadable: symbol;
	iterator: symbol;
	match: symbol;
	replace: symbol;
	search: symbol;
	species: symbol;
	split: symbol;
	toPrimitive: symbol;
	toStringTag: symbol;
	unscopables: symbol;
}
declare var Symbol: SymbolConstructor;

interface Map<K, V> {
	clear(): void;
	delete(key: K): boolean;
	entries(): IterableIterator<[K, V]>;
	forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
	get(key: K): V;
	has(key: K): boolean;
	keys(): IterableIterator<K>;
	set(key: K, value?: V): Map<K, V>;
	size: number;
	values(): IterableIterator<V>;
	[Symbol.iterator]():IterableIterator<[K,V]>;
	[Symbol.toStringTag]: string;
}
interface MapConstructor {
	new (): Map<any, any>;
	new <K, V>(): Map<K, V>;
	new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;
	prototype: Map<any, any>;
}
declare var Map: MapConstructor;