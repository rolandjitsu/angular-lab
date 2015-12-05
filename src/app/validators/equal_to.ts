import {
	provide,
	Directive,
	Input,
	Host
} from 'angular2/core';
import {
	NG_VALIDATORS,
	NgForm,
	ControlGroup,
	AbstractControl,
	Control,
	Validators,
	Validator
} from 'angular2/common';

import {isPresent} from '../../common/lang';

@Directive({
	selector: '[equal-to][ng-control],[equal-to][ng-form-control],[equal-to][ng-model]',
	providers: [
		provide(NG_VALIDATORS, {
			useExisting: EqualToValidator,
			multi: true
		})
	]
})

export class EqualToValidator implements Validator {
	form: ControlGroup;
	tc: AbstractControl;
	@Input('equal-to') target: string;
	constructor(@Host() formDir: NgForm) {
		this.form = formDir.form;
	}
 	validate(control: Control): {[key: string]: any} {
		if (isPresent(Validators.required(control))) return null;
		let form: ControlGroup = this.form;
		let target = form.find(this.target);
		if (!this.tc) {
			this.tc = target;
			this.tc.valueChanges.subscribe((value) => {
				control.updateValueAndValidity();
			});
		}
 		return target.value !== control.value
			? {'equalTo': true}
			: null;
	}
}
