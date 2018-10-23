import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Token} from '../../interfaces/token';

import {Events, ToastController} from '@ionic/angular';
import {Observable} from 'rxjs/internal/Observable';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiProvider {
  get token(): Token {
    return this._token;
  }

  set token(value: Token) {
    this._token = value;
  }

  private develop = 'http://cald.yosarin.net';
  private mock = 'http://localhost:8100/mock';
  private live: string;

  private _token: Token;
  private headers: HttpHeaders;

  constructor(public http: HttpClient,
              private events: Events,
              private router: Router,
              private toastCtrl: ToastController,
              private storage: Storage) {
    this.headers = new HttpHeaders();
  }

  public logout(): void {
    this.storage.remove('token').catch(err => console.log(err));
    delete this._token;
    this.router.navigate(['login']).catch(err => console.log(err));
  }

  private getHttpParams(token: boolean, pars?: {}): HttpParams {
    let httpParams = new HttpParams();

    if (pars) {
      for (const i in pars) {
        if (typeof pars[i] === 'object') {
          for (const ii in pars[i]) {
            httpParams = httpParams.set(i + '[' + ii + ']', pars[i][ii]);
          }
        } else {
          httpParams = httpParams.set(i, pars[i]);
        }
      }
    }

    if (token) {
      if (this.token.isValid()) {
        httpParams = httpParams.append('token', this.token.token);
        return httpParams;
      } else {
        this.logout();
      }
    } else {
      return httpParams;
    }
  }

  public delete(path: string, pars?: {}, token?: boolean): Observable<any> {
    if (token !== false) {
      token = true;
    }
    const httpParams = this.getHttpParams(token, pars);

    return new Observable((observer) => {
      this.http.delete(this.path(path), {params: httpParams}).subscribe((response) => {
        observer.next(this.processResponse(response));
        observer.complete();
      }, err => {
        this.processError(err);
        observer.error(err);
      });
    });
  }

  public post(path: string, data?: {}, pars?: {}, token?: boolean): Observable<any> {
    if (token !== false) {
      token = true;
    }
    const httpParams = this.getHttpParams(token, pars);

    return new Observable((observer) => {
      this.http.post(this.path(path), data, {params: httpParams}).subscribe((response) => {
        observer.next(this.processResponse(response));
        observer.complete();
      }, err => {
        this.processError(err);
        observer.error(err);
      });
    });
  }

  public put(path: string, data?: {}, pars?: {}, token?: boolean): Observable<any> {
    if (token !== false) {
      token = true;
    }
    const httpParams = this.getHttpParams(token, pars);
    return new Observable((observer) => {
      this.http.put(this.path(path), data, {params: httpParams}).subscribe((response) => {
        observer.next(this.processResponse(response));
        observer.complete();
      }, err => {
        this.processError(err);
        observer.error(err);
      });
    });
  }

  public get(path: string, pars?: {}, token?: boolean): Observable<any> {
    if (token !== false) {
      token = true;
    }
    const httpParams = this.getHttpParams(token, pars);

    return new Observable((observer) => {
      this.http.get(this.path(path), {params: httpParams}).subscribe((response) => {
        observer.next(this.processResponse(response));
        observer.complete();
      }, err => {
        this.processError(err);
        observer.error(err);
      });
    });
  }

  private processResponse(response): any {
    if (response['data']) {
      return response['data'];
    }
    return response;
  }

  private processError(err): any {
    console.log(err);
    console.log(err['status']);
    if (err['status'] === 403) {
      this.router.navigate(['login']).catch(err => console.log(err));
    }
  }

  public path(path): string {
    if (window.location.hostname.search('localhost') > -1) {
      // if (path == 'user/login') return [this.develop, path].join('/');
      return [this.develop, path].join('/');
    } else {
      return [this.live, path].join('/');
    }
  }

}
