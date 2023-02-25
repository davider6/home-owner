import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUser2Page } from './register-user2.page';

describe('RegisterUser2Page', () => {
  let component: RegisterUser2Page;
  let fixture: ComponentFixture<RegisterUser2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterUser2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUser2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
