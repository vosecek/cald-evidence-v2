import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonsPage } from './seasons.page';

describe('SeasonsPage', () => {
  let component: SeasonsPage;
  let fixture: ComponentFixture<SeasonsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
