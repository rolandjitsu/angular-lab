import {
	Input,
	Output,
	HostBinding,
	ElementRef,
	HostListener,
	EventEmitter,
	Component,
	Self,
	Attribute,
	ViewEncapsulation,
	ControlValueAccessor,
	NgControl,
	OpaqueToken,
	forwardRef,
	Provider
} from 'angular2/angular2';

import { isPresent } from '../../../common/lang';
import { KEY_CODES } from '../../../common/key_codes';
import { Glyph } from '../glyph/glyph';

const NG_VALUE_ACCESSOR: OpaqueToken = new OpaqueToken('NgValueAccessor');
const CHECKBOX_VALUE_ACCESSOR = new Provider(
	NG_VALUE_ACCESSOR,
	{
		useExisting: forwardRef(() => Checkbox),
		multi: true
	}
);

@Component({
	selector: 'checkbox[ng-control], checkbox[ng-form-control], checkbox[ng-model]',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: 'app/components/checkbox/checkbox.html',
	styleUrls: [
		'app/components/checkbox/checkbox.css'
	],
	providers: [
		CHECKBOX_VALUE_ACCESSOR
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
	@Output() update: EventEmitter = new EventEmitter();

	@HostListener('change', [
		'$event'
	])
	onChange;

	@HostListener('blur', [
		'$event'
	])
	onTouched;

	elementRef: ElementRef;
	private _tabindex: number;
	private _disabled: boolean = false;

	constructor(elementRef: ElementRef, @Self() cd: NgControl, @Attribute('tabindex') tabindex: string) {
		this._tabindex = isPresent(tabindex) ? parseInt(tabindex, 10) : 0;
		this.elementRef = elementRef;
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
		// This will make sure that NgControl picks up on the change
		// Custom elements don't have `change` events, so we emulate it
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
		let ev = new Event('change');
		this.elementRef.nativeElement.dispatchEvent(ev);
		this.update.next(this._checked);
	}
	registerOnChange(fn: (_: any) => void): void {
		this.onChange = (...args) => {
			fn.apply(null, args);
		};
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