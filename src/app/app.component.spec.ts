import {MATERIAL_SANITY_CHECKS} from '@angular/material';
import {async, TestBed} from '@angular/core/testing';
import {AppModule} from './app.module';
import {AppComponent} from './app.component';


describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
				imports: [AppModule],
				providers: [
					{provide: MATERIAL_SANITY_CHECKS, useValue: false}
				]
			})
			.compileComponents();
	}));

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app)
			.toBeTruthy();
	}));
});
