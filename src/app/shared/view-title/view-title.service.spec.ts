import {async, inject, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';

import {ViewTitleService} from './view-title.service';


describe('@infarm/dashboard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ViewTitleService,
                    useClass: ViewTitleService
                }
            ]
        });
    });

    describe('ViewTitleService()', () => {
        describe('.title', () => {
            it('should be an Observable', inject([ViewTitleService], (viewTitle: ViewTitleService) => {
                expect(viewTitle.title instanceof Observable).toBeTruthy();
            }));
        });
        describe('.set()', () => {
            it('should emit a value on the {title} Observable property', async(inject([ViewTitleService], (viewTitle: ViewTitleService) => {
                viewTitle.set('Test');

                viewTitle.title.subscribe(title => {
                    expect(title).toEqual('Test');
                });
            })));
        });
    });
});
