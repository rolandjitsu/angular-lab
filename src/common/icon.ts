import { Injectable, EventEmitter } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';
import * as Rx from 'rx';

let cache: Map<string, any> = new Map();

@Injectable()
export class IconStore {
	queue: Map<string, any> = new Map();
	constructor(private http: Http) {}
	get(url: string): EventEmitter {
		let that: IconStore = this;
		let subject: EventEmitter = new EventEmitter();
		if (cache.has(url)) {
			// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md#rxschedulerdefault
			// delay the next tick until the subject is returned, otherwise the subscriber will not be notified about the next tick if called before return
			let scheduler: Rx.Scheduler = Rx.Scheduler.default;
			scheduler.schedule(() => {
				subject.next(cache.get(url).cloneNode(true));
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
					.map((response) => svg(response))
					.subscribe((element) => {
						cache.set(url, element);
						subs.forEach(sub => sub.next(element.cloneNode(true)));
						that.queue.delete(url);
					});
			}
		}
		return subject;
	}
}

function svg (response: Response): Node {
	let parser: DOMParser = new DOMParser();
	let doc: Document = parser.parseFromString(
		response.text(),
		'image/svg+xml'
	);
	var svg = doc.querySelector('svg');
	return svg.cloneNode(true);
}