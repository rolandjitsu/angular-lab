import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {ExchangeService} from './shared/exchange.service';
import {FinanceComponent} from './finance.component';
import {ExchangeRatesComponent} from './exchange-rates/exchange-rates.component';
import {TrendsComponent} from './trends/trends.component';

import {financeRouting} from './finance.routing';


const ENTRY_COMPONENTS = [
	FinanceComponent,
	ExchangeRatesComponent,
	TrendsComponent
];


@NgModule({
	imports: [
		SharedModule,
		// Routing
		financeRouting
	],
	declarations: [...ENTRY_COMPONENTS],
	entryComponents: [...ENTRY_COMPONENTS],
	providers: [
		ExchangeService
	]
})
export class FinanceModule {}
