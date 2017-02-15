import {Route, PreloadingStrategy} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';


export class PreloadSelectedModulesOnly implements PreloadingStrategy {
	preload(route: Route, load: Function): Observable<any> {
		const {data} = route;
		const {preload = null} = data || {};
		return preload
			? load()
			: Observable.of(null);
	}
}
