import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureAccountsComponent } from './configure-accounts.component';

describe('ConfigureAccountsComponent', () => {
  let component: ConfigureAccountsComponent;
  let fixture: ComponentFixture<ConfigureAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
