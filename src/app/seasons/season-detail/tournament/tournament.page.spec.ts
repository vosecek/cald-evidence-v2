import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentPage } from './tournament.page';

describe('TournamentPage', () => {
  let component: TournamentPage;
  let fixture: ComponentFixture<TournamentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
