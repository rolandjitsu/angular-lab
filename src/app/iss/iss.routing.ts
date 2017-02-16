import {RouterModule} from '@angular/router';

import {IssComponent} from './iss.component';
import {AstronautsComponent} from './astronauts/astronauts.component';
import {LocationComponent} from './location/location.component';


export const farmsOverviewRouting = RouterModule.forChild([
	{
		path: '',
		component: IssComponent,
		children: [
			{
				path: 'astronauts',
				component: AstronautsComponent
			},
			{
				path: 'location',
				component: LocationComponent
			}
		]
	}
]);
