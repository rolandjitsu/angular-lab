import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';

import {openExchangeAppId} from '../../../env';
import {Currencies, CurrenciesResponse} from './currencies';
import {Rates, RatesResponse} from './rates';
import {Converter} from './converter';


export interface OpenExchangeError {
	error: boolean;
	status: number;
	message: string;
	description: string;
}

/*const statusCodes = new Map([
	['not_found', 404],
	['missing_app_id', 401],
	['invalid_app_id', 401],
	['not_allowed', 429],
	['access_restricted', 403],
	['invalid_base', 400]
]);*/



/**
 * Open Exchange API
 * https://openexchangerates.org
 */
@Injectable()
export class OpenExchangeService {
	static API_ROOT = 'https://openexchangerates.org/api';
	// API requests require authentication via app id, see https://docs.openexchangerates.org/docs/authentication for more info.
	static apiUrlForPath(path: string, params?: {[key: string]: any}): string {
		if (path.indexOf('/') !== 0) {
			path = `/${path};`
		}
		let url = `${this.API_ROOT}${path}.json?app_id=${openExchangeAppId}`;

		if (typeof params === 'object' && params !== null) {
			for (const [key, value] of Object.entries(params)) {
				url += `?${key}=${value}`;
			}
		}

		return url;
	}

	constructor(private http: Http) {}

	/**
	 * Get a list of all available currencies.
	 * https://docs.openexchangerates.org/docs/currencies-json
	 * Alternative Currency: https://docs.openexchangerates.org/v0.7/docs/alternative-currencies
	 * @param {boolean} showAlternativeCurrency - Include unofficial currencies (bitcoin, etc.).
	 */
	currencies(showAlternativeCurrency: boolean = false): Observable<Currencies> {
		const params = {};
		if (showAlternativeCurrency) {
			Object.assign(params, {show_alternative: 1});
		}

		return this.http.get(OpenExchangeService.apiUrlForPath('/currencies', params))
			.map((response: Response) => response.json())
			.map((json: CurrenciesResponse) => new Currencies(json))
			.multicast(new ReplaySubject())
			.refCount();
	}

	/**
	 * Get latest exchange rates.
	 * https://docs.openexchangerates.org/docs/latest-json
	 */
	rates(): Observable<Rates> {
		return this.http.get(OpenExchangeService.apiUrlForPath('/latest'))
			.map((response: Response) => response.json())
			.map((json: RatesResponse) => new Rates(json))
			.multicast(new ReplaySubject())
			.refCount();
	}

	converter(): Converter {
		return new Converter(this.rates());
	}
}
