import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentEditPage } from './tournament-edit.page';

describe('TournamentEditPage', () => {
  let component: TournamentEditPage;
  let fixture: ComponentFixture<TournamentEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
