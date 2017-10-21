import {MATERIAL_SANITY_CHECKS} from '@angular/material';
import {async, inject, TestBed} from '@angular/core/testing';

import 'rxjs/add/operator/take';

import {ViewTitleModule} from './view-title.module';
import {ViewTitleComponent} from './view-title.component';
import {ViewTitleService} from './view-title.service';


describe('ViewTitleComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ViewTitleModule],
            providers: [
                {provide: MATERIAL_SANITY_CHECKS, useValue: false}
            ]
        }).compileComponents();
    }));

    it('should create the <rj-view-title> component', async(() => {
        const fixture = TestBed.createComponent<ViewTitleComponent>(ViewTitleComponent);
        const viewTitleComponent: ViewTitleComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        expect(viewTitleComponent).toBeTruthy();
        fixture.destroy();
    }));

    it('should update the text when ViewTitleService emits a new value', async(inject([ViewTitleService], (viewTitle: ViewTitleService) => {
        const fixture = TestBed.createComponent<ViewTitleComponent>(ViewTitleComponent);
        const viewTitleComponent: ViewTitleComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();

        viewTitle.set('Test');

        fixture.detectChanges();

        viewTitleComponent.title.take(1)
            .subscribe(title => {
                expect(title).toEqual('Test');
                fixture.destroy();
            });
    })));
});
