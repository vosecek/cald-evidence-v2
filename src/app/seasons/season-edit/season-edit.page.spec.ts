import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonEditPage } from './season-edit.page';

describe('SeasonEditPage', () => {
  let component: SeasonEditPage;
  let fixture: ComponentFixture<SeasonEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
