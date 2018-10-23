import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {SeasonProvider} from '../providers/season/season';
import {TeamProvider} from '../providers/team/team';

@Injectable({
  providedIn: 'root'
})
export class SeasonsGuard implements CanActivate {

  constructor(private season: SeasonProvider, private router: Router, private team: TeamProvider) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<any>((resolve) => {
      Promise.all([
        this.season.load(),
        this.team.load()
      ]).then(() => {
        resolve(true);
      }, err => {
        this.router.navigate(['login']).catch(err => console.log(err));
      });
    });
  }
}
