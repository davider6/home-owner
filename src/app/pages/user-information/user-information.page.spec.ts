import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationPage } from './user-information.page';

describe('UserInformationPage', () => {
  let component: UserInformationPage;
  let fixture: ComponentFixture<UserInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
