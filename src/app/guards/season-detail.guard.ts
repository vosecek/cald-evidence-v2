import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {SeasonProvider} from '../providers/season/season';
import {TournamentProvider} from '../providers/tournament/tournament';

@Injectable({
  providedIn: 'root'
})
export class SeasonDetailGuard implements CanActivate {

  constructor(private season: SeasonProvider, private tournament: TournamentProvider) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const id = next.paramMap.get('season');

    return new Promise<any>((resolve, reject) => {
      Promise.all([
        this.tournament.tournamentsBySeason(id),
        this.season.findById(id)
      ]).then(() => {
        resolve(true);
      }, err => {
        resolve(false);
      });
    });
  }
}
