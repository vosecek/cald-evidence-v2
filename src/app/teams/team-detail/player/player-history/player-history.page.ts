import {Component, OnInit} from '@angular/core';
import {PlayerProvider} from '../../../../providers/player/player';
import {IPlayer} from '../../../../interfaces/player';
import {ITeam} from '../../../../interfaces/team';
import {ISeason} from '../../../../interfaces/season';
import {ITournament} from '../../../../interfaces/tournament';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-player-history',
  templateUrl: './player-history.page.html',
  styleUrls: ['./player-history.page.scss'],
})
export class PlayerHistoryPage implements OnInit {

  public playerHistory: { player: IPlayer, seasons: { home_teams: ITeam[], season: ISeason, tournaments: { tournament: ITournament, team: ITeam }[] }[] };
  private player: IPlayer;

  constructor(private playerProvider: PlayerProvider, private modal: ModalController) {
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
    this.playerProvider.history(this.player).then((history) => {
      this.playerHistory = history;
    }, err => {
      console.log(err);
    });
  }

}
