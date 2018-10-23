import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TeamProvider} from '../providers/team/team';

@Injectable({
  providedIn: 'root'
})
export class TeamsGuard implements CanActivate {

  constructor(private teams: TeamProvider) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise<any>((resolve, reject) => {
      this.teams.load().then(() => {
        resolve(true);
      }, err => {
        reject(err);
      });
    });
  }
}
