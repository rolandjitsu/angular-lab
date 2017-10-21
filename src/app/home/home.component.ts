import {Component} from '@angular/core';
import {ViewTitleService} from '../shared';

@Component({
    selector: 'rj-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.scss'
    ]
})
export class HomeComponent {
    constructor(viewTitle: ViewTitleService) {
        viewTitle.set('Home');
    }
}
