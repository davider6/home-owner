import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSignPage } from './users-sign.page';

describe('UsersSignPage', () => {
  let component: UsersSignPage;
  let fixture: ComponentFixture<UsersSignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersSignPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
