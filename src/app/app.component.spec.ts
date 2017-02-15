import {TestBed, async} from '@angular/core/testing';
import {AppModule} from './app.module';
import {AppComponent} from './app.component';


describe('AppComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({imports: [AppModule]});
		TestBed.compileComponents();
	});

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app)
			.toBeTruthy();
	}));
});
