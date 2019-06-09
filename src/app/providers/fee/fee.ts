import {Injectable} from '@angular/core';
import {GeneralProvider} from '../general/general';
import {ApiProvider} from '../api/api';
import {ISeason} from '../../interfaces/season';
import {ILeague} from '../../interfaces/league';
import {IFee} from '../../interfaces/fee';
import {ToastController} from '@ionic/angular';
import {IPlayer} from '../../interfaces/player';
import {ITeam} from '../../interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class FeeProvider extends GeneralProvider {

  protected code = 'fee';
  protected updatePut = true;

  constructor(public api: ApiProvider) {
    super(api);
  }


  public activateFee(season: ISeason, league: ILeague, fee: IFee) {
    const path = ['fee', fee.id];
    path.push('activate');

    this.api.post(path.join('/'), {fee_id: fee.id, first_season_id: season.id, league_id: league.id}).then(async () => {
      const toast = await new ToastController().create({message: 'Poplatek přiřazen k sezoně', duration: 3000});
      return toast.present();
    }, async err => {
      const toast = await new ToastController().create({message: err, duration: 3000});
      return toast.present();
    });
  }

  public pardonFee(player: IPlayer, season: ISeason) {
    this.api.post('admin/fee/pardon', {
      player_id: player.id,
      season_id: season.id,
    }).catch(err => console.log(err));
  }

  public revokePardonFee(pardonFee: any) {
    this.api.delete('admin/fee/pardon', {
      pardon_id: pardonFee
    }).catch(err => console.log(err));
  }

  public getTeamFee(team: ITeam, season: ISeason): Promise<any> {
    return this.api.get(['team', team.id, 'season', season.id, 'fee'].join('/'));
  }

  public getAllFee(season: ISeason): Promise<any> {
    return this.api.get(['admin', 'fee'].join('/'), {season_id: season.id});
  }
}
