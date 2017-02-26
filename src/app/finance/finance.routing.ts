import {RouterModule} from '@angular/router';

import {FinanceComponent} from './finance.component';
import {ExchangeRatesComponent} from './exchange-rates/exchange-rates.component';
import {TrendsComponent} from './trends/trends.component';


export const financeRouting = RouterModule.forChild([
	{
		path: '',
		component: FinanceComponent,
		children: [
			{
				path: 'exchange-rates',
				component: ExchangeRatesComponent
			},
			{
				path: 'trends',
				component: TrendsComponent
			},
		]
	}
]);
