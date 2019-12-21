import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatcherDataPage } from './catcher-data.page';

describe('CatcherDataPage', () => {
  let component: CatcherDataPage;
  let fixture: ComponentFixture<CatcherDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatcherDataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatcherDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
