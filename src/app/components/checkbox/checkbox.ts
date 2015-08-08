import { NumberWrapper, isPresent } from 'angular2/src/facade/lang';
import { KeyboardEvent } from 'angular2/src/facade/browser';
import {
	EventEmitter,
	Renderer,
	ElementRef,
	Component,
	View,
	Self,
	Attribute,
	ViewEncapsulation,
	ControlValueAccessor,
	NgControl
} from 'angular2/angular2';

import { KEY_CODES } from 'common/key_codes';
import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { Icon } from '../icon/icon';

@Component({
	selector: 'checkbox',
	events: ['change'],
	properties: [
		'checked',
		'disabled'
	],
	host: {
		'(keydown)': 'onKeydown($event)',
		'(change)': 'onChange($event)',
		'(blur)': 'onTouched()',
		'[tabindex]': 'tabindex',
		'[attr.aria-checked]': 'checked',
		'[attr.aria-disabled]': 'disabled',
		'[class.ng-untouched]': 'ngClassUntouched',
		'[class.ng-touched]': 'ngClassTouched',
		'[class.ng-pristine]': 'ngClassPristine',
		'[class.ng-dirty]': 'ngClassDirty',
		'[class.ng-valid]': 'ngClassValid',
		'[class.ng-invalid]': 'ngClassInvalid',
		'role': 'checkbox'
	}
})

@View({
	encapsulation: isNativeShadowDOMSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED (default), NATIVE, NONE
	templateUrl: 'app/components/checkbox/checkbox.html',
	styleUrls: [
		'app/components/checkbox/checkbox.css'
	],
	directives: [
		Icon
	]
})

export class Checkbox implements ControlValueAccessor {
	checked: boolean = false;
	change: EventEmitter = new EventEmitter();
	tabindex: number;
	onChange: Function = () => {};
	onTouched: Function = () => {};
	private _disabled: boolean = false;
	private cd: NgControl;

	constructor(@Self() cd: NgControl, private renderer: Renderer, private elementRef: ElementRef, @Attribute('tabindex') tabindex: string) {
		this.cd = cd;
		this.cd.valueAccessor = this;
		this.tabindex = isPresent(tabindex) ? NumberWrapper.parseInt(tabindex, 10) : 0;
	}

	get ngClassUntouched(): boolean {
		return isPresent(this.cd.control) ? this.cd.control.untouched : false;
	}
	get ngClassTouched(): boolean {
		return isPresent(this.cd.control) ? this.cd.control.touched : false;
	}
	get ngClassPristine(): boolean {
		return isPresent(this.cd.control) ? this.cd.control.pristine : false;
	}
	get ngClassDirty(): boolean {
		return isPresent(this.cd.control) ? this.cd.control.dirty : false;
	}
	get ngClassValid(): boolean {
		return isPresent(this.cd.control) ? this.cd.control.valid : false;
	}
	get ngClassInvalid(): boolean {
		return isPresent(this.cd.control) ? !this.cd.control.valid : false;
	}
	get disabled() {
		return this._disabled;
	}

	set disabled(value) {
		this._disabled = isPresent(value) && value !== false;
	}

	toggle(event) {
		if (this.disabled) return event.stopPropagation();
		this.checked = !this.checked;
		this.change.next(this.checked);
	}
	registerOnChange(fn: (_: any) => {}): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: () => {}): void {
		this.onTouched = fn;
	}
	writeValue(value: any) {
		this.checked = value;
	}

	onKeydown(event: KeyboardEvent) {
		if (event.keyCode !== KEY_CODES.SPACE) return;
		event.preventDefault();
		this.toggle(event);
	}
}