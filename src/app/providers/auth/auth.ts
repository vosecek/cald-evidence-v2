import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {IUser, User} from '../../interfaces/user';
import {Token} from '../../interfaces/token';
import {Storage} from '@ionic/storage';
import {DivisionProvider} from '../division/division';
import {PlayerProvider} from '../player/player';
import {TeamProvider} from '../team/team';
import {Events, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthProvider {
  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  private _user: User;

  constructor(private api: ApiProvider,
              private storage: Storage,
              private events: Events) {
  }

  // public protectedArea(): Promise<any> {
  //   return new Promise<boolean>((resolve, reject) => {
  //     if (this.user) {
  //       resolve(true);
  //     }
  //
  //     this.configureTokenFromStorage().then(() => {
  //       this.getUser().then(() => {
  //         resolve(true);
  //       }, err => {
  //         resolve();
  //       });
  //     }, err => {
  //       resolve();
  //     });
  //   });
  // }

  public setTokenToStorage(token): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.storage.set('token', token).then(() => {
        this.configureTokenFromStorage().then(() => {
          resolve();
        }, err => {
          reject(err);
        });
      }, err => {
        reject(err);
      });
    });

  }

  private configureTokenFromStorage(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.storage.get('token').then((token) => {
        if (token) {
          this.api.token = new Token(token);
          if (this.api.token.isValid()) {
            resolve();
          } else {
            this.api.logout();
            reject();
          }
        } else {
          this.api.logout();
          reject();
        }
      });
    });
  }

  public authenticate(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isLogged()) {
        resolve();
      }
      this.configureTokenFromStorage().then(() => {
        Promise.all([
          this.getUser()
        ]).then(() => {
          resolve();
        }, err => {
          console.log(err);
          reject(err);
        });


      }, err => {
        reject(err);
      });
    });
  }

  public isLogged(): boolean {
    if (!this.api.token) {
      return false;
    }
    if (!this.user) {
      return false;
    }
    return this.api.token.isValid();
  }

  public login(data): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.post('user/login', data, null, false).then(val => {
        this.setTokenToStorage(val['token']).then(() => {
          this.getUser().then(() => {
            resolve();
          }, err => {
            reject(err);
          });
        }, err => {
          reject(err);
        });
      }, err => {
        reject(err);
      });
    });
  }

  getUser(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.get('user/me').then(data => {
        this.user = new User(data);
        this.events.publish('user:login');
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  updateUser(data): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.put('user/me', data).then(ok => {
        resolve();
      }, err => {
        reject(err);
      });
    });
  }


}
