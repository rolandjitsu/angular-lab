import { NumberWrapper, isPresent } from 'angular2/src/facade/lang';
import { EventEmitter } from 'angular2/src/facade/async'
import { KeyboardEvent } from 'angular2/src/facade/browser';
import { ElementRef } from 'angular2/core';
import { Renderer } from 'angular2/render';
import { Component, View, Attribute } from 'angular2/annotations';
import { ControlValueAccessor, NgControl } from 'angular2/forms';

import { KEY_SPACE } from 'common/constants';
import { Icon } from 'app/directives';

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
		'[checked]': 'checked',
		'[tabindex]': 'tabindex',
		'[attr.aria-checked]': 'checked',
    	'[attr.aria-disabled]': 'disabled',
		'[class.ng-untouched]': 'cd.control?.untouched == true',
		'[class.ng-touched]': 'cd.control?.touched == true',
		'[class.ng-pristine]': 'cd.control?.pristine == true',
		'[class.ng-dirty]': 'cd.control?.dirty == true',
		'[class.ng-valid]': 'cd.control?.valid == true',
		'[class.ng-invalid]': 'cd.control?.valid == false',
		'role': 'checkbox'
	}
})

@View({
	templateUrl: 'app/components/checkbox/checkbox.html',
	styles: [
		'@import "checkbox.css";'
	],
	directives: [
		Icon
	]
})

export class Checkbox implements ControlValueAccessor {
	checked: boolean = false;
	change: EventEmitter = new EventEmitter();
	_disabled: boolean = false;
	tabindex: number;
	onChange: Function = (_) => {};
	onTouched: Function = (_) => {};
	
	constructor(private cd: NgControl, private renderer: Renderer, private elementRef: ElementRef, @Attribute('tabindex') tabindex: string) {
		this.cd.valueAccessor = this;
		this.tabindex = isPresent(tabindex) ? NumberWrapper.parseInt(tabindex, 10) : 0;
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
	registerOnChange(fn): void {
		this.onChange = fn;
	}
	registerOnTouched(fn): void {
		this.onTouched = fn;
	}
	writeValue(value) {
		this.checked = value;
		this.renderer.setElementProperty(
			this.elementRef.parentView.render,
			this.elementRef.boundElementIndex,
			'checked',
			value
		);
	}
	
	onKeydown(event: KeyboardEvent) {
		if (event.keyCode != KEY_SPACE) return;
		event.preventDefault();
		this.toggle(event);
	}
}