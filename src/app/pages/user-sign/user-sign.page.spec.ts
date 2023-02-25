import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignPage } from './user-sign.page';

describe('UserSignPage', () => {
  let component: UserSignPage;
  let fixture: ComponentFixture<UserSignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSignPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
