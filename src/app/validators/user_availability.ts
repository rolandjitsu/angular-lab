import {provide, Directive} from 'angular2/core';
import {
	NG_ASYNC_VALIDATORS,
	Control,
	Validators,
	Validator
} from 'angular2/common';

import {isPresent} from '../../common/lang';
import {User} from '../services';

@Directive({
	selector: '[user-availability][ng-control],[user-availability][ng-form-control],[user-availability][ng-model]',
	providers: [
		provide(NG_ASYNC_VALIDATORS, {
			useExisting: UserAvailabilityValidator,
			multi: true
		})
	]
})

export class UserAvailabilityValidator implements Validator {
	validate(control: Control): {[key: string]: any} {
		if (isPresent(Validators.required(control))) return null;
		let email: string = control.value;
		return new Promise((resolve) => {
			User.query({by: {email}}).then((users) => {
				let emails = Array.from(users.values()).map((user) => user.email);
				console.log(emails, control);
				resolve(
					emails.includes(email)
						? {'userAvailability': true}
						: null
				);
			});
		});
	}
}
