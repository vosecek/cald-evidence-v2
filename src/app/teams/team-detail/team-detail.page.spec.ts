import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDetailPage } from './team-detail.page';

describe('TeamDetailPage', () => {
  let component: TeamDetailPage;
  let fixture: ComponentFixture<TeamDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
