import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {IssService} from './shared/iss.service';
import {IssComponent} from './iss.component';
import {AstronautsComponent} from './astronauts/astronauts.component';
import {LocationComponent} from './location/location.component';

import {farmsOverviewRouting} from './iss.routing';


const ENTRY_COMPONENTS = [
	IssComponent,
	AstronautsComponent,
	LocationComponent
];


@NgModule({
	imports: [
		SharedModule,
		// Routing
		farmsOverviewRouting
	],
	declarations: [...ENTRY_COMPONENTS],
	entryComponents: [...ENTRY_COMPONENTS],
	providers: [
		IssService
	]
})
export class IssModule {}
