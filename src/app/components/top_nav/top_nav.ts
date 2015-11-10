import {
	CORE_DIRECTIVES,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	Component,
	ViewEncapsulation
} from 'angular2/angular2';

import { ROUTER_DIRECTIVES } from 'angular2/router';

import { Glyph } from '../glyph/glyph';

@Component({
	selector: 'top_nav',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: 'app/components/top_nav/top_nav.html',
	styleUrls: [
		'app/components/top_nav/top_nav.css'
	],
	directives: [
		CORE_DIRECTIVES,
		Glyph
	]
})

export class TopNav {}