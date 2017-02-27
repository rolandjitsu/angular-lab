import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';

import {openExchangeAppId} from '../../../env';
import {Currencies, CurrenciesResponse, Currency} from './currencies';
import {Rates, RatesResponse} from './rates';
import {RateSeries, RateSeriesResponse} from './series';


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
			path = `/${path};`;
		}
		let url = `${this.API_ROOT}${path}.json?app_id=${openExchangeAppId}`;

		if (typeof params === 'object' && params !== null) {
			for (const [key, value] of Object.entries(params)) {
				url += `&${key}=${value}`;
			}
		}

		return url;
	}

	private datePipe: DatePipe;

	constructor(private http: Http, @Inject(LOCALE_ID) locale: string) {
		this.datePipe = new DatePipe(locale);
	}

	/**
	 * Convert a date to the format required by Open Exchange.
	 * @return {string} A date formatted to YYYY-MM-DD.
	 */
	toOpenExchangeDateFormat(date: Date): string {
		return `${this.datePipe.transform(date, 'yyyy-MM-dd')}`;
	}

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

	/**
	 * Get time series for exchange rates.
	 * https://docs.openexchangerates.org/docs/time-series-json
	 */
	series(start: Date, end: Date, currencies: Currency[] = []): Observable<Rates> {
		return this.http.get(OpenExchangeService.apiUrlForPath('/time-series', {
				start: this.toOpenExchangeDateFormat(start),
				end: this.toOpenExchangeDateFormat(end),
				symbols: currencies.map((currency) => currency.code)
					.join(',')
			}))
			.map((response: Response) => response.json())
			.map((json: RateSeriesResponse) => new RateSeries(currencies, json))
			.multicast(new ReplaySubject())
			.refCount();
	}
}
