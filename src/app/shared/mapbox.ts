import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import {point} from '@turf/helpers';
import {mapboxAccessToken} from '../../env';

Object.assign(mapboxgl, {
	accessToken: mapboxAccessToken
});
const {Map, AttributionControl, LngLat} = mapboxgl;


export class MapboxMap {
	constructor(private readonly map: mapboxgl.Map) {}

	// More details at https://www.mapbox.com/mapbox-gl-js/example/animate-point-along-line.
	addPoint(coordinates: GeoJSON.Position, paint: mapboxgl.CirclePaint): any {
		const id = Math.random()
			.toString(36)
			.substring(7);

		const layer = {id, source: id, type: 'circle'};
		// Add a source and layer displaying a point which will be animated in a circle.
		const source: mapboxgl.GeoJSONSourceRaw = {type: 'geojson', data: point(coordinates)};

		Object.assign(layer, {paint});

		this.map.addSource(id, source);
		this.map.addLayer(layer);

		return this.map.getSource(id);
	}

	flyTo(options: mapboxgl.FlyToOptions): this {
		this.map.flyTo(options);
		return this;
	}
}


export {
	Map,
	AttributionControl,
	LngLat
};
