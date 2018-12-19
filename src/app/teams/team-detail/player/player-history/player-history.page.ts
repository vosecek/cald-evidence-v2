import {Component, OnInit} from '@angular/core';
import {PlayerProvider} from '../../../../providers/player/player';
import {IPlayer} from '../../../../interfaces/player';
import {ITeam} from '../../../../interfaces/team';
import {ISeason} from '../../../../interfaces/season';
import {ITournament} from '../../../../interfaces/tournament';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-player-history',
  templateUrl: './player-history.page.html',
  styleUrls: ['./player-history.page.scss'],
})
export class PlayerHistoryPage implements OnInit {

  public playerHistory: { player: IPlayer, seasons: { home_teams: ITeam[], season: ISeason, tournaments: { tournament: ITournament, team: ITeam }[] }[] };
  private player: IPlayer;

  constructor(private playerProvider: PlayerProvider, private router: Router, private modal: ModalController) {
  }

  dismiss(toClose?: boolean) {
    toClose = toClose || false;
    this.modal.dismiss(toClose).catch(err => console.log(err));
  }

  tournamentDetail(tournament: ITournament) {
    this.dismiss(true);
    this.router.navigate(['seasons', tournament.season_id, tournament.id]).catch(err => console.log(err));
  }

  ngOnInit() {
    this.playerProvider.history(this.player).then((history) => {
      this.playerHistory = history;
      this.playerHistory.seasons.reverse();
    }, err => {
      console.log(err);
    });
  }

}
