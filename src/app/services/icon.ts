import {Http, Response} from 'angular2/http';
import 'rxjs/add/operator/map';

import {Defer} from '../common/async';
import {Animation} from '../common/animation';

let cache: Map<any, any> = new Map();

export class Icon {
	queue: Map<any, any> = new Map();
	private _http: Http;
	constructor(http: Http) {
		this._http = http;
	}
	get(url: string): Promise<SVGElement> {
		let defer: Defer<SVGElement> = new Defer();
		if (cache.has(url)) {
			// Delay the next tick until the defer is returned,
			// otherwise the subscriber will not be notified about the resolution if called before return
			Animation.rAF(function () {
				defer.resolve(cache.get(url).cloneNode(true));
			});
		} else {
			let pending: boolean = this.queue.has(url);
			if (!pending) this.queue.set(url, []);
			let queue: any[] = this.queue.get(url);
			queue.push(defer);
			if (!pending) this._http
				.get(url)
				.map((response: Response) => svg(response))
				.subscribe((element) => {
					cache.set(url, element);
					queue.forEach((item) => item.resolve(element.cloneNode(true)));
					this.queue.delete(url);
				});
		}
		return defer.promise;
	}
}

function svg(response: Response): Node {
	let parser: DOMParser = new DOMParser();
	let doc: Document = parser.parseFromString(
		response.text(),
		'image/svg+xml'
	);
	let svg = doc.querySelector('svg');
	return svg.cloneNode(true);
}