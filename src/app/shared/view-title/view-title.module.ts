import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VIEW_TITLE_SERVICE_PROVIDER} from './view-title.service';
import {ViewTitleComponent} from './view-title.component';


const components: any[] = [
    ViewTitleComponent
];


@NgModule({
    imports: [CommonModule],
    declarations: [...components],
    exports: [...components],
    providers: [
        VIEW_TITLE_SERVICE_PROVIDER
    ]
})
export class ViewTitleModule {

}
