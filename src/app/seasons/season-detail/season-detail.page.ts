import {Component, OnInit} from '@angular/core';
import {TournamentProvider} from '../../providers/tournament/tournament';
import {ITournament} from '../../interfaces/tournament';
import {ActivatedRoute} from '@angular/router';
import {SeasonProvider} from '../../providers/season/season';
import {ISeason} from '../../interfaces/season';
import {ModalController} from '@ionic/angular';
import {TournamentEditPage} from './tournament/tournament-edit/tournament-edit.page';
import {AuthProvider} from '../../providers/auth/auth';

@Component({
  selector: 'app-season-detail',
  templateUrl: './season-detail.page.html',
  styleUrls: ['./season-detail.page.scss'],
})
export class SeasonDetailPage implements OnInit {

  public data: ISeason;
  public tournaments: ITournament[];

  constructor(public tournament: TournamentProvider,
              public auth: AuthProvider,
              private season: SeasonProvider,
              private modal: ModalController,
              private route: ActivatedRoute) {
  }

  async addTournament() {
    const modal = await this.modal.create({
      component: TournamentEditPage,
      componentProps: {season: this.data}
    });

    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });

    return modal.present();
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.tournament.tournamentsBySeason(data['season']).then((data) => {
        this.tournaments = data;
      }, err => {
        console.log(err);
      });
      this.season.findById(data['season']).then(s => {
        this.data = s;
        console.log(this.data);
      }, err => {
        console.log(err);
      });
    });
  }

}
