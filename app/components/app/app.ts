// TODO: implement relative paths using a helper function base on the article below
// http://blog.thoughtram.io/angular/2016/06/08/component-relative-paths-in-angular-2.html
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
