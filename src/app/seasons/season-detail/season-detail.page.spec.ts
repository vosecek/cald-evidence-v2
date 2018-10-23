import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonDetailPage } from './season-detail.page';

describe('SeasonDetailPage', () => {
  let component: SeasonDetailPage;
  let fixture: ComponentFixture<SeasonDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
