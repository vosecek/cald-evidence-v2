import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthProvider} from '../providers/auth/auth';
import {LeagueProvider} from '../providers/league/league';
import {DivisionProvider} from '../providers/division/division';
import {NationalityProvider} from '../providers/nationality/nationality';
import {SeasonProvider} from '../providers/season/season';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private authProvider: AuthProvider, private season: SeasonProvider, private nationality: NationalityProvider, private router: Router, private league: LeagueProvider, private division: DivisionProvider) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise<any>((resolve, reject) => {
      this.authProvider.authenticate().then(() => {
        Promise.all([
          this.league.load(),
          this.season.load(),
          this.nationality.load(),
          this.division.load()
        ]).then(() => {
          resolve(true);
        }, err => {
          console.log(err);
          reject(err);
        });
      }, err => {
        this.router.navigate(['login']).catch(err => console.log(err));
        resolve(false);
      });
    });

  }
}