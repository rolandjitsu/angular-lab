import {
    APP_INITIALIZER,
    ModuleWithProviders,
    NgModule,
    Optional,
    SkipSelf
} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoConflictStyleCompatibilityMode} from '@angular/material';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';

import {environment} from '../../environments/environment';
import {SharedModule, ViewTitleService} from '../shared';


/**
 * Module with service singletons.
 * Check https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-module for details why.
 */
@NgModule({
    imports: [
        // IMPORTANT: BrowserAnimationsModule must only be imported and used once!
        BrowserAnimationsModule,
        // Material 2 compat mode
        // Throws on use of 'md-' selector
        NoConflictStyleCompatibilityMode,
        BrowserModule,
        // Firebase
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        // App modules
        SharedModule
    ],
    exports: [
        SharedModule
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('angular-lab#CoreModule has already been loaded. Import it in the AppModule only.');
        }
    }

    // tslint:disable-next-line: member-ordering
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            // These services are only going to be created once (one instance for the entire app),
            // not per module import.
            providers: [
                // We don't have any reason for a component in the rendered component tree to know about these (at this time).
                // As such, we'll be using the APP_INITIALIZER multi-collection
                // (which is kind of like a run block in Angular 1.x).
                {
                    provide: APP_INITIALIZER,
                    useFactory: provideViewTitleHandler,
                    deps: [
                        ViewTitleService
                    ],
                    multi: true
                }
            ]
        };
    }
}


export function provideViewTitleHandler(viewTitle: ViewTitleService): () => void {
    return () => {
        // Subscribe to view title changes and update the document title.
        viewTitle.title.subscribe(title => {
            document.title = title ? `Angular Lab - ${title}` : 'Angular Lab';
        });
    };
}
