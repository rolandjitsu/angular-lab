import {
    Directive,
    OnInit,
    OnDestroy,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subscription} from 'rxjs/Subscription';


/**
 * Directive for rendering elements if there's a user authenticated
 * It's similar to *ngIf
 * Docs: https://angular.io/guide/structural-directives#write-a-structural-directive
 * @example
 * <div *rjIfAuth></div>
 */
@Directive({selector: '[rjIfAuth]'})
export class IfAuthDirective implements OnInit, OnDestroy {
    private hasView: boolean;
    private subs: Subscription[] = [];

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private afAuth: AngularFireAuth
    ) {}

    ngOnInit(): void {
        this.subs.push(...[
            this.afAuth.authState.subscribe(user => {
                if (user && !this.hasView) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                    this.hasView = true;
                } else if (!user && this.hasView) {
                    this.viewContainer.clear();
                    this.hasView = false;
                }
            })
        ]);
    }
    ngOnDestroy(): void {
        for (const sub of this.subs) {
            sub.unsubscribe();
        }
    }
}
