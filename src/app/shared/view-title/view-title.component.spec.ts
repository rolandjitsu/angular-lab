import {MATERIAL_SANITY_CHECKS} from '@angular/material';
import {async, inject, TestBed} from '@angular/core/testing';

import {SharedModule} from '../shared.module';
import {ViewTitleComponent} from './view-title.component';
import {ViewTitleService} from './view-title.service';


describe('ViewTitleComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
				imports: [SharedModule],
				providers: [
					{provide: MATERIAL_SANITY_CHECKS, useValue: false}
				]
			})
			.compileComponents();
	}));

	it('should create the <rj-view-title> component', async(() => {
		const fixture = TestBed.createComponent<ViewTitleComponent>(ViewTitleComponent);
		const viewTitleComponent: ViewTitleComponent = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		expect(viewTitleComponent)
			.toBeTruthy();
		fixture.destroy();
	}));

	it('should update the text when ViewTitleService emits a new value', async(inject([ViewTitleService], (viewTitle: ViewTitleService) => {
		const fixture = TestBed.createComponent<ViewTitleComponent>(ViewTitleComponent);
		const viewTitleComponent: ViewTitleComponent = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		viewTitle.set('Test');
		fixture.detectChanges();
		expect(viewTitleComponent.title).toEqual('Test');
		fixture.destroy();
	})));
});
