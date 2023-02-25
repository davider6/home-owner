import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriesPage } from './subcategories.page';

describe('SubcategoriesPage', () => {
  let component: SubcategoriesPage;
  let fixture: ComponentFixture<SubcategoriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoriesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
