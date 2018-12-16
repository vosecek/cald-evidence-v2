import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {IPlayerAtRoster, IRoster} from '../../../../../interfaces/roster';
import {PlayerAtTeamProvider} from '../../../../../providers/player-at-team/player-at-team';
import {PlayerProvider} from '../../../../../providers/player/player';
import {IPlayer} from '../../../../../interfaces/player';
import {PlayerAtRosterProvider} from '../../../../../providers/player-at-roster/player-at-roster';
import {RosterProvider} from '../../../../../providers/roster/roster';
import {PlayerPage} from '../../../../../teams/team-detail/player/player.page';
import {TeamProvider} from '../../../../../providers/team/team';
import {ITournament} from '../../../../../interfaces/tournament';
import {TeamPipe} from '../../../../../shared/pipes/team.pipe';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
})
export class PlayerListPage implements OnInit {

  public sex: string = '0';
  public active = 1;

  public roster: IRoster;
  private tournament: ITournament;
  public players: IPlayer[] = [];
  public playersAtRoster: IPlayerAtRoster[] = [];
  public player_at_roster: any[] = [];
  public inProgress = 0;
  public showSearchBar = false;
  public search = '';
  public source: any[] = [];
  public activePlayers: IPlayer[] = [];

  constructor(
    private modal: ModalController,
    public playerAtRoster: PlayerAtRosterProvider,
    private playerAtTeam: PlayerAtTeamProvider,
    private teamProvider: TeamProvider,
    private toastCtrl: ToastController,
    private modalCtrl2: ModalController,
    private alertCtrl: AlertController,
    private rosterProvider: RosterProvider,
    public playerProvider: PlayerProvider) {
  }

  public isAtRoster(player: IPlayer): boolean {
    return !!this.playersAtRoster.find(it => it.player_id === player.id);
  }

  private getActivePlayers() {
    this.playerAtRoster.api.get(['team', this.roster.team_id, 'season', this.tournament.season_id, 'fee'].join('/')).then(data => {
      const team_name = this.teamProvider.getById(this.roster.team_id).name;
      if (data['fee'] && data['fee'][team_name] && data['fee'][team_name]['players']) {
        this.activePlayers = data['fee'][team_name]['players'];
        console.log(this.activePlayers);
      }
    }, err => {
      console.log(err);
    });
  }

  public rosterChanged(ev, player: IPlayer) {
    if (this.player_at_roster[player.id]) {
      this.addPlayer(ev, player);
    } else {
      this.dropPlayer(player);
    }
  }

  playerDetail(player?: IPlayer) {
    this.teamProvider.findById(this.roster.team_id).then(async team => {
      const modal = await this.modalCtrl2.create({component: PlayerPage, componentProps: {team: team, player: (player ? player : null)}});
      modal.onDidDismiss().then((d) => {
        this.ngOnInit();
      });
      return modal.present();
    });
  }

  openSearchPlayer(show?: boolean) {
    this.showSearchBar = show;

    if (this.showSearchBar) {
      this.source = this.playerProvider.data;
      this.playerAtTeam.load().then(() => {

      }, err => {

      });
      this.playerProvider.load().then(() => {
        console.log('loaded all players');
      }, err => {
        console.log(err);
      });
    } else {
      this.source = this.players;
    }
  }

  private addPlayer(ev, player: IPlayer) {
    this.inProgress++;
    this.rosterProvider.addPlayerToRoster(player, this.roster).then(async data => {
      this.inProgress--;
      const toast = await this.toastCtrl.create({
        message: [player.last_name, player.first_name].join(' ') + ' přidán/a do soupisky',
        duration: 1000
      });
      return toast.present();
    }, async err => {
      ev.target.checked = false;
      this.inProgress--;
      const al = await this.alertCtrl.create({
        header: 'Chyba při ukládání',
        subHeader: err,
        message: [player.last_name, player.first_name].join(' ') + ' nebyl/a uložen do soupisky',
        buttons: ['OK']
      });
      return al.present();
    });
  }

  private dropPlayer(player: IPlayer) {
    this.inProgress++;
    this.rosterProvider.removePlayerFromRoster(player, this.roster).then(async data => {
      this.inProgress--;
      const toast = await this.toastCtrl.create({
        message: [player.last_name, player.first_name].join(' ') + ' odebrán/a ze soupisky',
        duration: 1000
      });
      return toast.present();
    }, async err => {
      this.inProgress--;
      const al = await this.alertCtrl.create({
        header: 'Chyba při ukládání',
        subHeader: err,
        message: [player.last_name, player.first_name].join(' ') + ' nebyl/a odebrán zesoupisky',
        buttons: ['OK']
      });
      return al.present();
    });
  }

  ngOnInit() {
    this.player_at_roster = [];
    this.getActivePlayers();
    this.playerAtRoster.load({roster_id: this.roster.id}).then(data => {
      this.playersAtRoster = data;

      this.playerAtTeam.loadDataByMaster('team_id', this.roster.team_id, {}, true).then(data => {
        this.players = data.map(x => x['player']);
        this.source = this.players;
        this.players.forEach(it => {
          if (it) {
            this.player_at_roster[it.id] = this.isAtRoster(it);
          }
        });

        this.playersAtRoster.forEach(el => {
          if (!this.players.find(it => it && it.id === el.player_id)) {
            this.playerProvider.findById(el.player_id).then((p) => {
              this.players.push(p);
              this.player_at_roster[p.id] = true;
            }, err => {
              console.log(err);
            });
          }
        });
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

}
