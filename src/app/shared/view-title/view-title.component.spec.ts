import {TestBed, async, inject} from '@angular/core/testing';
import {ViewTitleComponent} from './view-title.component';
import {AppModule} from '../../app.module';
import {ViewTitleService} from '../../core';


describe('ViewTitleComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({imports: [AppModule]})
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
