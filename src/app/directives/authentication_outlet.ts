import {
	Injector,
	Directive,
	Attribute,
	ElementRef,
	DynamicComponentLoader
} from 'angular2/angular2';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';

import { isUserAuthenticated } from 'common/authentication';
import { Login } from 'app/components';

@Directive({
	selector: 'router-outlet'
})

export class AuthenticationOutlet extends RouterOutlet {
	constructor(private _elementRef: ElementRef, private _loader: DynamicComponentLoader, private _parentRouter: Router, @Attribute('name') nameAttr: string) {
		super(_elementRef, _loader, _parentRouter, nameAttr);
	}

	activate(nextInstruction: ComponentInstruction): Promise<any> {
		// if (nextInstruction.componentType != Login && !isUserAuthenticated()) this._parentRouter.navigateByUrl('/login');
		return super.activate(nextInstruction);
	}
}