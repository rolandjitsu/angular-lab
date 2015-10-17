import { EventEmitter } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';

import { Animation } from '../../common/animation';

let cache: Map<any, any> = new Map();

export class Icon {
	queue: Map<any, any> = new Map();
	private _http: Http;
	constructor(http: Http) {
		this._http = http;
	}
	get(url: string): any {
		let subject: EventEmitter = new EventEmitter();
		subject = subject.toRx();
		if (cache.has(url)) {
			// Delay the next tick until the subject is returned,
			// otherwise the subscriber will not be notified about the next tick if called before return
			Animation.rAF(function () {
				subject.next(cache.get(url).cloneNode(true));
			});
		} else {
			let pending: boolean = this.queue.has(url);
			if (!pending) this.queue.set(url, []);
			let subs: any[] = this.queue.get(url);
			if (pending) subs.push(subject);
			else {
				subs.push(subject);
				this._http
					.get(url)
					.map((response) => svg(response))
					.subscribe((element) => {
						cache.set(url, element);
						subs.forEach((sub) => sub.next(element.cloneNode(true)));
						this.queue.delete(url);
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
	let svg = doc.querySelector('svg');
	return svg.cloneNode(true);
}