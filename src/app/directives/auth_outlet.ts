import {
	Directive,
	Attribute,
	DynamicComponentLoader,
	ComponentRef,
	ElementRef
} from 'angular2/angular2';
import { RouterOutlet, Router, ComponentInstruction } from 'angular2/router';

import { AuthClient } from '../services';
import { Auth, Login, Register, Change, Reset } from '../components';

@Directive({
	selector: 'auth-outlet'
})

export class AuthOutlet extends RouterOutlet {
	private _router: Router;
	private _client: AuthClient;
	constructor(_elementRef: ElementRef, _loader: DynamicComponentLoader, _parentRouter: Router, _client: AuthClient, @Attribute('name') nameAttr: string) {
		super(_elementRef, _loader, _parentRouter, nameAttr);
		this._router = _parentRouter;
		this._client = _client;
	}
	activate(nextInstruction: ComponentInstruction): Promise<any> {
		let component = nextInstruction.componentType;
		let isAllowed = this._client.isAuthenticated()
			|| (component instanceof Auth
			|| component instanceof Login
			|| component instanceof Reset
			|| component instanceof Change
			|| component instanceof Register);
		console.log(nextInstruction.componentType, component instanceof Auth);
		if (isAllowed) this._router.navigateByUrl('/login');
		return super.activate(nextInstruction);
	}
}