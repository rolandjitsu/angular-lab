import { Injectable, Inject, Http } from 'angular2/angular2';

import { Defer } from 'common/defer';
import { HttpResponseParser } from 'common/dom_parser';

let cache: Map<string, any> = new Map();

@Injectable()
export class IconStore {
	queue: Map<string, any> = new Map();
	constructor(@Inject(Http) private http) {}
	get(url: string): Promise<Node> {
		let that: IconStore = this;
		if (cache.has(url)) return Promise.resolve(
			cache.get(url).cloneNode(true)
		);
		else {
			let pending: boolean = this.queue.has(url);
			let defer = new Defer();
			if (!pending) this.queue.set(url, []);
			let promises: Defer<Node>[] = this.queue.get(url);
			if (pending) promises.push(defer);
			else {
				promises.push(defer);
				this.http
					.get(url)
					.toRx()
					.map(response => HttpResponseParser.svg(response))
					.subscribe(element => {
						cache.set(url, element);
						promises.forEach(promise => promise.resolve(element.cloneNode(true)));
						that.queue.delete(url);
					});
			}
			return defer.promise;
		}
	}
}