import {
	Component,
	ViewEncapsulation
} from '@angular/core';

const COMPONENT_BASE_PATH = './app/components/app';

@Component({
	selector: 'app',
	// ViewEncapsulation options: ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	encapsulation: ViewEncapsulation.Emulated,
	templateUrl: `${COMPONENT_BASE_PATH}/app.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/app.css`
	]
})

export class App {}
