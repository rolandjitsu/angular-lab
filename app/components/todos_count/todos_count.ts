import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	Component,
	ViewEncapsulation
} from 'angular2/core';

import {Chores} from '../../services';

const COMPONENT_BASE_PATH = './app/components/todos_count';

@Component({
	selector: 'todos-count',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: `${COMPONENT_BASE_PATH}/todos_count.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/todos_count.css`
	]
})

export class TodosCount {
	count: number = 0;
	constructor(@Inject(Chores) csp: Promise<Chores>, cdRef: ChangeDetectorRef) {
		csp.then((cs) => {
			cs.observe((snapshot: FirebaseDataSnapshot) => {
				this.count = cs.length;
				cdRef.markForCheck();
			});
		});
	}
}
