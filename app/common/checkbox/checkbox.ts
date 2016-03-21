import {
	Input,
	Output,
	HostBinding,
	HostListener,
	EventEmitter,
	Component,
	Self,
	Attribute,
	ViewEncapsulation
} from 'angular2/core';
import {
	ControlValueAccessor,
	NgControl
} from 'angular2/common';

import {isPresent} from '../lang';
import {KEY_CODES} from '../key_codes';
import {Glyph} from '../glyph/glyph';

const COMPONENT_BASE_PATH = './app/common/checkbox';

@Component({
	selector: 'checkbox[ngControl], checkbox[ngFormControl], checkbox[ngModel]',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: `${COMPONENT_BASE_PATH}/checkbox.html`,
	styleUrls: [
		`${COMPONENT_BASE_PATH}/checkbox.css`
	],
	directives: [
		Glyph
	],
	inputs: [
		'disabled'
	]
})

export class Checkbox implements ControlValueAccessor {
	@Input('checked') _checked: boolean = false;
	@Output('change') onChange: EventEmitter<any> = new EventEmitter();

	@HostListener('blur', [
		'$event'
	])
	onTouched;

	private _tabindex: number;
	private _disabled: boolean = false;

	constructor(@Self() cd: NgControl, @Attribute('tabindex') tabindex: string) {
		this._tabindex = isPresent(tabindex) ? parseInt(tabindex, 10) : 0;
		cd.valueAccessor = this; // Validation will not work if we don't set the control's value accessor
	}

	@HostBinding('attr.tabindex')
	get tabindex(): number {
		return this._tabindex;
	}

	@HostBinding('attr.aria-checked')
	get checked(): boolean {
		return this._checked;
	}

	@HostBinding('attr.aria-disabled')
	get disabled(): boolean {
		return this._disabled;
	}

	@HostBinding('attr.role')
	get role(): string {
		return 'checkbox';
	}

	set disabled(value) {
		this._disabled = isPresent(value) && value !== false;
	}

	toggle(event): void {
		if (this.disabled) return event.stopPropagation();
		this.onChange.next(!this._checked);
	}
	registerOnChange(fn: (_: any) => void): void {
		this.onChange.subscribe(fn);
	}
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}
	writeValue(value: any): void {
		this._checked = value;
	}

	@HostListener('keydown', [
		'$event'
	])
	onKeydown(event: KeyboardEvent): void {
		if (event.keyCode !== KEY_CODES.SPACE) return;
		event.preventDefault();
		this.toggle(event);
	}
}
