import {MATERIAL_SANITY_CHECKS} from '@angular/material';
import {async, TestBed} from '@angular/core/testing';
import {AccountModule} from './account.module';
import {AccountComponent} from './account.component';


describe('AccountComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AccountModule],
            providers: [
                {provide: MATERIAL_SANITY_CHECKS, useValue: false}
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AccountComponent);
        const accountComponent: AccountComponent = fixture.debugElement.componentInstance;
        expect(accountComponent).toBeTruthy();
        fixture.detectChanges();
        fixture.destroy();
    }));
});
