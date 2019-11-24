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
import {ToolsService} from '../../../../providers/tools.service';
import {TeamProvider} from '../../../../providers/team/team';


@Component({
  selector: 'app-tournament-edit',
  templateUrl: './tournament-edit.page.html',
  styleUrls: ['./tournament-edit.page.scss'],
})
export class TournamentEditPage implements OnInit {

  public tournament: ITournament;
  public form: FormGroup;
  public currentDate = null;

  constructor(private tournamentProvider: TournamentProvider,
              public leagueProvider: LeagueProvider,
              public teamProvider: TeamProvider,
              private modal: ModalController,
              public divisionProvider: DivisionProvider,
              public seasonProvider: SeasonProvider,
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
      organizing_team_id: ['', [Validators.required]],
      season_id: ['', [Validators.required]]
    });
  }

  save() {
    let data = this.form.value;
    data = ToolsService.dateConverter(data);

    this.tournamentProvider.updateCreateItem(data).then((data) => {
      if (data[0] && data[0]['tournament']) {
        this.form.patchValue({id: data[0]['tournament']['id']});
      }
      this.modal.dismiss().catch(err => console.log(err));
    }, err => {
      console.log(err);
    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
    if (!this.tournament) {
      this.currentDate = moment().format('YYYY-MM-DD')
      this.form.patchValue({season_id: new OrderPipe().transform(this.seasonProvider.data, ['-name'])[0].id});
    } else {
      this.currentDate = this.tournament.date.format('YYYY-MM-DD');
      this.form.patchValue({
        id: this.tournament.id,
        name: this.tournament.name,
        organizing_team_id: this.tournament.organizing_team_id,
        location: this.tournament.location,
        season_id: this.tournament.season_id,
        league_ids: this.tournament.leagues.map(e => e.id),
        division_ids: this.tournament.divisions.map(e => e.id),
        duration: this.tournament.duration
      });
      this.form.controls.league_ids.disable();
      this.form.controls.division_ids.disable();
    }
  }

}
