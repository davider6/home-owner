import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderPage } from './new-order.page';

describe('NewOrderPage', () => {
  let component: NewOrderPage;
  let fixture: ComponentFixture<NewOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
