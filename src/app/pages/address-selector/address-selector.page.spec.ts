import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSelectorPage } from './address-selector.page';

describe('AddressSelectorPage', () => {
  let component: AddressSelectorPage;
  let fixture: ComponentFixture<AddressSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressSelectorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
