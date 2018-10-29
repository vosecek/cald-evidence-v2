import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalitiesPage } from './nationalities.page';

describe('NationalitiesPage', () => {
  let component: NationalitiesPage;
  let fixture: ComponentFixture<NationalitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationalitiesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
