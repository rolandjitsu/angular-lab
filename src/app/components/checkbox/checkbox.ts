import { NumberWrapper, isPresent } from 'angular2/src/facade/lang';
import { KeyboardEvent } from 'angular2/src/facade/browser';
import { ElementRef } from 'angular2/core';
import { Renderer } from 'angular2/render';
import { Component, View, Attribute } from 'angular2/annotations';
import { ControlValueAccessor, NgControl } from 'angular2/forms';

import { KEY_SPACE } from 'common/constants';
import { Icon } from 'app/directives';

@Component({
	selector: 'checkbox',
	properties: [
		// 'checked',
		'disabled'
	],
	host: {
		'(keydown)': 'onKeydown($event)',
		'(change)': 'onChange($event.target.checked)',
		'(blur)': 'onTouched()',
		'[checked]': 'checked',
		'[tabindex]': 'tabindex',
		'[attr.role]': '"checkbox"',
		'[attr.aria-checked]': 'checked',
    	'[attr.aria-disabled]': 'disabled',
		'[class.ng-untouched]': 'cd.control?.untouched == true',
		'[class.ng-touched]': 'cd.control?.touched == true',
		'[class.ng-pristine]': 'cd.control?.pristine == true',
		'[class.ng-dirty]': 'cd.control?.dirty == true',
		'[class.ng-valid]': 'cd.control?.valid == true',
		'[class.ng-invalid]': 'cd.control?.valid == false'
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
	checked: boolean;
	tabindex: number;
	onChange: Function;
	onTouched: Function;
	_disabled: boolean;
	
	constructor(private cd: NgControl, private renderer: Renderer, private elementRef: ElementRef, @Attribute('tabindex') tabindex: string) {
		this.checked = false;
		this.tabindex = isPresent(tabindex) ? NumberWrapper.parseInt(tabindex, 10) : 0;
		this.onChange = (_) => {};
		this.onTouched = (_) => {};
		cd.valueAccessor = this;
		this._disabled = false;
		console.log(renderer, elementRef, cd);
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