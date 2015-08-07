import { Injectable, Inject, Http, EventEmitter } from 'angular2/angular2';
import { ObservableWrapper } from 'angular2/src/facade/async';
import * as Rx from 'rx';

import { HttpResponseParser } from 'common/dom_parser';

let cache: Map<string, any> = new Map();

@Injectable()
export class IconStore {
	queue: Map<string, any> = new Map();
	constructor(@Inject(Http) private http) {}
	get(url: string): EventEmitter {
		let that: IconStore = this;
		let subject: EventEmitter = new EventEmitter();
		if (cache.has(url)) {
			// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerdefault
			// delay the next tick until the subject is returned, otherwise the subscriber will not be notified about the next tick if called before return
			let scheduler: Rx.Scheduler = Rx.Scheduler.default;
			scheduler.schedule(() => {
				ObservableWrapper.callNext(subject, cache.get(url).cloneNode(true));
			});
		}
		else {
			let pending: boolean = this.queue.has(url);
			if (!pending) this.queue.set(url, []);
			let subs: EventEmitter[] = this.queue.get(url);
			if (pending) subs.push(subject);
			else {
				subs.push(subject);
				this.http
					.get(url)
					.toRx()
					.map((response) => HttpResponseParser.svg(response))
					.subscribe((element) => {
						cache.set(url, element);
						subs.forEach(sub => ObservableWrapper.callNext(sub, element.cloneNode(true)));
						that.queue.delete(url);
					});
			}
		}
		return subject;
	}
}