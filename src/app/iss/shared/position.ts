import {point} from '@turf/helpers';

export class IssPosition {
	constructor(public readonly source: mapboxgl.GeoJSONSource) {}

	update(coordinates: GeoJSON.Position): void {
		// Update position on the map.
		this.source.setData(point(coordinates));
	}
}
