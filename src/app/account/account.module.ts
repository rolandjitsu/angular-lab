import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
} from '@angular/material';
import {AngularFireAuthModule} from 'angularfire2/auth';

import {SharedModule} from '../shared';
import {AccountRoutingModule} from './account-routing.module';

import {AccountComponent} from './account.component';
import {ProfileComponent} from './profile/profile.component';


@NgModule({
    imports: [
        // Angular
        FormsModule,
        // Material
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        // Firebase
        AngularFireAuthModule,
        // Auth
        SharedModule,
        AccountRoutingModule
    ],
    declarations: [
        AccountComponent,
        ProfileComponent
    ]
})
export class AccountModule {}
