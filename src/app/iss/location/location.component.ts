import {
	Component,
	ElementRef,
	OnInit,
	OnDestroy,
	ViewChild
} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/switchMapTo';

import {visible} from '../../shared/animations';
import {MapboxMap, LngLat} from '../../shared/mapbox';
import {MapboxService} from '../../shared/map.service';
import {PoolingService} from '../shared/pooling.service';
import {IssService} from '../shared/iss.service';
import {IssPosition} from '../shared/position';


@Component({
	selector: 'rj-location',
	templateUrl: './location.component.html',
	styleUrls: [
		'./location.component.scss'
	],
	animations: [
		visible
	]
})
export class LocationComponent implements OnInit, OnDestroy {
	@ViewChild('map', {read: ElementRef}) mapRef: ElementRef;

	private mapbox: Observable<MapboxMap>;
	private position: IssPosition;

	private subs: Subscription[] = [];

	constructor(private iss: IssService, private map: MapboxService, private pooling: PoolingService) {}

	ngOnInit(): void {
		this.mapbox = this.map.create(this.mapRef.nativeElement);
		const position = this.pooling.execute(() => this.iss.position(), 1500)
			.share();

		this.subs.push(...[
			position.switchMapTo(this.mapbox, (...args: any[]) => args)
				.subscribe(([{coordinates}, map]) => {
					if (!(this.position instanceof IssPosition)) {
						// Render the user (it's location) on the map if it wasn't added.
						const source = map.addPoint(coordinates, {
							'circle-radius': 8,
							'circle-color': '#2196F3',
							'circle-stroke-width': 3,
							'circle-stroke-color': '#F5F5F5'
						});
						this.position = new IssPosition(source);
					} else {
						// Update ISS position.
						this.position.update(coordinates);
					}
				}),
			// Move camera when ISS position changes.
			position.switchMapTo(this.mapbox, (...args: any[]) => args)
				.subscribe(([position, map]) => {
					const [longitude, latitude] = position.coordinates;

					map.flyTo({
						zoom: 4,
						center: new LngLat(longitude, latitude),
						pitch: 0,
					});
				})
		]);
	}

	ngOnDestroy(): void {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
	}
}
