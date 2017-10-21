import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ViewTitleService} from './view-title.service';

@Component({
    selector: 'rj-view-title',
    templateUrl: './view-title.component.html'
})
export class ViewTitleComponent {
    title: Observable<string> = this.viewTitle.title;
    constructor(private viewTitle: ViewTitleService) {}
}
