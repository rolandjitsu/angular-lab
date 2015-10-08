import {
	Input,
	Output,
	HostBinding,
	HostListener,
	EventEmitter,
	Component,
	View,
	Self,
	Attribute,
	ViewEncapsulation,
	ControlValueAccessor,
	NgControl,
	OpaqueToken,
	forwardRef,
	Binding
} from 'angular2/angular2';

import { isPresent, isNativeShadowDomSupported } from 'common/lang';
import { KEY_CODES } from 'common/key_codes';
import { Icon } from '../icon/icon';

const NG_VALUE_ACCESSOR: OpaqueToken = new OpaqueToken('NgValueAccessor');
const CHECKBOX_VALUE_ACCESSOR = new Binding(
	NG_VALUE_ACCESSOR,
	{
		toAlias: forwardRef(() => Checkbox),
		multi: true
	}
);

@Component({
	selector: 'checkbox[ng-control], checkbox[ng-form-control], checkbox[ng-model]',
	bindings: [
		CHECKBOX_VALUE_ACCESSOR
	],
	inputs: [
		'disabled'
	]
})

@View({
	encapsulation: isNativeShadowDomSupported ? ViewEncapsulation.Native : ViewEncapsulation.Emulated, // Emulated, Native, None (default)
	templateUrl: 'app/components/checkbox/checkbox.html',
	styleUrls: [
		'app/components/checkbox/checkbox.css'
	],
	directives: [
		Icon
	]
})

export class Checkbox implements ControlValueAccessor {
	@Input('checked') _checked: boolean = false;
	@Output() change: EventEmitter = new EventEmitter();

	@HostListener('change', [
		'$event.target.value'
	])
	onChange;

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
	get disabled() {
		return this._disabled;
	}

	@HostBinding('attr.role')
	get role(): string {
		return 'checkbox';
	}

	set disabled(value) {
		this._disabled = isPresent(value) && value !== false;
	}

	toggle(event) {
		if (this.disabled) return event.stopPropagation();
		this._checked = !this._checked;
		// Not sure if this should be done: this.onChange(this._checked);
		this.change.next(this._checked); // Throws exception, will be fixed in next alpha version
	}
	registerOnChange(fn: (_: any) => void): void {
		this.onChange = fn;
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
	onKeydown(event: KeyboardEvent) {
		if (event.keyCode !== KEY_CODES.SPACE) return;
		event.preventDefault();
		this.toggle(event);
	}
}