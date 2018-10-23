import {Component, OnInit} from '@angular/core';
import {ITournament, ITournamentBelongsToLeagueAndDivision} from '../../../../interfaces/tournament';
import {TournamentProvider} from '../../../../providers/tournament/tournament';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {LeagueProvider} from '../../../../providers/league/league';
import {DivisionProvider} from '../../../../providers/division/division';
import {SeasonProvider} from '../../../../providers/season/season';
import {OrderPipe} from '../../../../shared/pipes/order';

import * as moment from 'moment';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-tournament-edit',
  templateUrl: './tournament-edit.page.html',
  styleUrls: ['./tournament-edit.page.scss'],
})
export class TournamentEditPage implements OnInit {

  protected tournament: ITournament;
  protected form: FormGroup;

  constructor(private tournamentProvider: TournamentProvider,
              protected leagueProvider: LeagueProvider,
              private modal: ModalController,
              protected divisionProvider: DivisionProvider,
              protected seasonProvider: SeasonProvider,
              private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      league_ids: ['', [Validators.required]],
      division_ids: ['', [Validators.required]],
      location: ['', [Validators.required]],
      season_id: ['', [Validators.required]]
    });
  }

  protected save() {
    const data = this.form.value;
    if (data['date']) {
      if (data['date']['year']) {
        data['date'] = [data['date']['year']['text'], data['date']['month']['text'], data['date']['day']['text']].join('-');
      }
    }
    this.tournamentProvider.updateCreateItem(data).then((data) => {
      if (data[0] && data[0]['tournament']) {
        this.form.patchValue({id: data[0]['tournament']['id']});
      }
    }, err => {
      console.log(err);
    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
    if (!this.tournament) {
      this.form.patchValue({season_id: new OrderPipe().transform(this.seasonProvider.data, ['-name'])[0].id});
    } else {
      console.log(this.tournament);
      this.form.patchValue({
        id: this.tournament.id,
        name: this.tournament.name,
        location: this.tournament.location,
        season_id: this.tournament.season_id,
        league_ids: this.tournament.leagues.map(e => e.id),
        division_ids: this.tournament.divisions.map(e => e.id),
        date: moment(this.tournament.date).toISOString(),
        duration: this.tournament.duration
      });
    }
  }

}
