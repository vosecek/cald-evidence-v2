import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {NationalityProvider} from '../providers/nationality/nationality';

@Injectable({
  providedIn: 'root'
})
export class PlayerGuard implements CanActivate {

  constructor(private nationality: NationalityProvider) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('player guard');
    return new Promise<any>((resolve, reject) => {
      this.nationality.load().then(() => {
        resolve();
      }, err => {
        reject();
      });
    });
  }
}
