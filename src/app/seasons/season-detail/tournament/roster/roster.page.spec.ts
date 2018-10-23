import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterPage } from './roster.page';

describe('RosterPage', () => {
  let component: RosterPage;
  let fixture: ComponentFixture<RosterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
