import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	Component,
	ViewEncapsulation
} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {Chores} from '../../services';
import {Glyph} from '../glyph/glyph';

@Component({
	moduleId: module.id, // CommonJS standard
	selector: 'todos-count',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './todos_count.html',
	styleUrls: [
		'./todos_count.css'
	],
	directives: [
		CORE_DIRECTIVES,
		Glyph
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