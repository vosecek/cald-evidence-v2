import {Component, OnInit} from '@angular/core';
import {TeamProvider} from '../../providers/team/team';
import {ITeam} from '../../interfaces/team';
import {ActivatedRoute} from '@angular/router';
import {IPlayer} from '../../interfaces/player';
import {PlayerAtTeamProvider} from '../../providers/player-at-team/player-at-team';
import {ModalController} from '@ionic/angular';
import {PlayerPage} from './player/player.page';
import {PlayerProvider} from '../../providers/player/player';
import {AuthProvider} from '../../providers/auth/auth';
import {TeamEditPage} from '../team-edit/team-edit.page';
import {SeasonProvider} from '../../providers/season/season';
import {ISeason} from '../../interfaces/season';
import {OrderPipe} from '../../shared/pipes/order';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
})
export class TeamDetailPage implements OnInit {

  public data: ITeam;
  public players: IPlayer[] = [];
  public search = '';
  public active = 1;
  public activePlayers: IPlayer[] = [];
  public currentSeason: ISeason;

  constructor(
    private modalCtrl: ModalController,
    private teamProvider: TeamProvider,
    public playerProvider: PlayerProvider,
    private route: ActivatedRoute,
    public seasonProvider: SeasonProvider,
    public auth: AuthProvider,
    private playerAtTeam: PlayerAtTeamProvider) {
  }

  private getActivePlayers() {
    this.currentSeason = new OrderPipe().transform(this.seasonProvider.data, ['-name'])[0];
    this.playerProvider.api.get(['team', this.data.id, 'season', this.currentSeason.id, 'fee'].join('/')).then(data => {
      const team_name = this.teamProvider.getById(this.data.id).name;
      if (data['fee'] && data['fee'][team_name] && data['fee'][team_name]['players']) {
        this.activePlayers = data['fee'][team_name]['players'];
      }
    }, err => {
      console.log(err);
    });
  }

  canViewPlayerDetails() {
    return (this.auth.user.isAdmin() || this.auth.user.isTeamAdmin(this.data.id));
  }

  async editTeam() {
    const modal = await this.modalCtrl.create({component: TeamEditPage, componentProps: {team: this.data}});
    return modal.present();
  }

  async playerDetail(player?: IPlayer) {
    if (!this.canViewPlayerDetails()) return;
    const modal = await this.modalCtrl.create({component: PlayerPage, componentProps: {team: this.data, player: (player ? player : null)}});


    modal.onDidDismiss().then((toRemove) => {
      if (toRemove['data']) {
        this.players.splice(this.players.indexOf(player), 1);
      } else {
        if (player) {
          const item = this.players.find(it => it.id === player.id);
          if (item) {
            this.playerProvider.findById(item.id).then(data => {
              this.players[this.players.indexOf(item)] = data;
            });
          }
        } else {
          this.ngOnInit();
        }
      }
    });
    return modal.present();
  }

  ngOnInit() {
    this.players = [];
    this.route.params.subscribe(pars => {
      this.teamProvider.findById(pars['team']).then(t => {
        this.data = t;
        this.getActivePlayers();
        this.playerAtTeam.load({'team_id': this.data.id}, true).then(data => {
          data.forEach(p => {
            if (!this.players.includes(p.player)) {
              this.players = this.players.concat(p.player);
            }
          });
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
    });
  }
}
