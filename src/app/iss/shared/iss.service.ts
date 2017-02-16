import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';


export interface Astronaut {
	craft: string;
	name: string;
}


@Injectable()
export class IssService {
	constructor(private http: Http) {}

	position(): Observable<{
		coordinates: GeoJSON.Position,
		timestamp: number
	}> {
		return this.http.get('http://api.open-notify.org/iss-now.json')
			.map((response) => response.json())
			.map(({iss_position, timestamp}) => Object.assign({timestamp}, {
				coordinates: [
					iss_position.longitude,
					iss_position.latitude
				]
			}))
			.share();
	}

	astronauts(): Observable<Astronaut[]> {
		return this.http.get('http://api.open-notify.org/astros.json')
			.map((response) => response.json())
			.map(({people}) => people)
			.share();
	}
}
