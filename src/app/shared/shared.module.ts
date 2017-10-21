import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

/**
 * Angular 2 Material
 * Docs: https://material.angular.io
 */
import {
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule
} from '@angular/material';

/**
 * Angular 2 Flex Layout
 * Integration with Angular CLI: https://github.com/angular/flex-layout/wiki/Integration-with-Angular-CLI
 * API: https://github.com/angular/flex-layout/wiki/API-Documentation
 */
import {FlexLayoutModule} from '@angular/flex-layout';


/**
 * App modules
 */
import {ViewTitleModule} from './view-title/view-title.module';


/**
 * Modules
 */
export const modules: any[] = [
    // Angular
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule,
    // Flex Layout
    FlexLayoutModule,
    // Material
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    // App
    ViewTitleModule
];

/**
 * Components
 */
export const components: any[] = [];

/**
 * Entry Components
 */
export const entryComponents: any[] = [];

/**
 * Directives
 */
export const directives: any[] = [];

/**
 * Pipes
 */
export const pipes: any[] = [];

/**
 * Guards
 */
export const guards = [];

/**
 * Resolvers
 */
export const resolvers: any[] = [];

/**
 * Services
 */
export const services: any[] = [];


// NOTE: Do not specify providers for modules that might be imported by a lazy loaded module,
// especially when the provider needs to be a singleton, use `forRoot()` instead.
@NgModule({
    // A list of supporting modules.
    // Specifically, the list of modules whose exported components,
    // directives or pipes are referenced by the component templates declared in this module.
    imports: [...modules],
    // Components/Directives/Pipes
    // Declared classes are visible within the module but invisible to components in a different module unless (a) they are exported from this module and (b) that other module imports this one.
    declarations: [
        ...directives,
        ...components,
        ...entryComponents,
        ...pipes
    ],
    entryComponents: [...entryComponents],
    // A list of DI providers that an importing module can use.
    providers: [
        ...services,
        ...guards,
        ...resolvers
    ],
    // A list of declarations (component, directive,
    // and pipe classes) that an importing module can use.
    exports: [
        ...modules,
        ...directives,
        ...components,
        ...pipes
    ]
})
export class SharedModule {

}
