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
import {AuthRoutingModule} from './auth-routing.module';

import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ResetComponent} from './reset/reset.component';


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
        AuthRoutingModule
    ],
    declarations: [
        AuthComponent,
        LoginComponent,
        RegisterComponent,
        ResetComponent
    ]
})
export class AuthModule {}
