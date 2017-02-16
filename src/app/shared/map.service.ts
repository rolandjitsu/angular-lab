import {Injectable, NgZone} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import {AttributionControl, Map, MapboxMap} from './mapbox';


export interface Listeners {
	[name: string]: (event: any, subscription: Subscription) => void;
}


@Injectable()
export class MapboxService {
	readonly options = {
		attributionControl: false,
		style: 'mapbox://styles/mapbox/streets-v9',
		trackResize: true,
		touchZoomRotate: true,
		zoom: 2
	};

	constructor(private zone: NgZone) {}

	create(element: HTMLElement, listeners: Listeners = {}): Observable<MapboxMap> {
		// Create a new map by passing a native HTMLElement.
		const zone = this.zone;
		const ready = new ReplaySubject<any>();
		const map: mapboxgl.Map = new Map(Object.assign({container: element}, this.options));
		const attribution = new AttributionControl();

		map.once('load', () => {
			// NOTE: We are required to render this due to copyright.
			map.addControl(attribution, 'bottom-right');
			zone.run(() => {
				ready.next(true);
				ready.complete();
			});

			// Register listeners.
			for (const [name, handler] of Object.entries(listeners)) {
				const sub = Observable.fromEvent(map, name)
					.subscribe((event) => {
						handler(event, sub);
					});
			}
		});

		// When the map is ready emit the observable with the map object.
		return ready.asObservable()
			.map(() => new MapboxMap(map))
			.share();
	}
}
