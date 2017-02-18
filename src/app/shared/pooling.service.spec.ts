import {TestBed, async, inject} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {TestScheduler} from 'rxjs/testing/TestScheduler';
import {PoolingService} from './pooling.service';


describe('PoolingService', () => {
	let scheduler: TestScheduler;

	beforeEach(() => {
		scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
		// E.g. if we schedule work every 1s, in 2000ms we can schedule work 2 times.
		scheduler.maxFrames = 2000;
		TestBed.configureTestingModule({
			providers: [PoolingService]
		});
	});

	describe('execute()', () => {
		it('should execute the operation every n ms', async(inject([PoolingService], (pooling: PoolingService) => {
			const spy = jasmine.createSpy('count');

			const operation: () => Observable<any> = () => {
				return Observable.create((observer: Observer<any>) => {
					observer.next(true);
					spy();
				})
			};

			pooling.execute(() => operation(), 1000, scheduler)
				.subscribe(() => {});

			scheduler.flush();

			expect(spy.calls.count())
				.toBeGreaterThanOrEqual(2);
		})));
	});
});
