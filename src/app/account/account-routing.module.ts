import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AccountComponent} from './account.component';
import {ProfileComponent} from './profile/profile.component';


export const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        children: [
            {path: '', component: ProfileComponent, pathMatch: 'full'}
        ]
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule {}
