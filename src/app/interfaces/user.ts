import {IPrivilege} from './privilege';

export interface IUser {
  email: string;
  id: string;
  login: string;
  state: string;
  privileges: IPrivilege[];
}

export class User {
  private _user: IUser;
  private _rights: string[];

  constructor(data) {
    if (data['user']) this._user = data['user'];
    if (data['rights']) this._rights = data['rights'];
  }

  get user(): IUser {
    return this._user;
  }

  get rights(): string[] {
    return this._rights;
  }

  public isTournamentAdmin(id): boolean {
    return false;
  }

  public getTeamId() {
    return this.rights[0].split(':')[2];
  }

  public isCurrentUser(user_id): boolean {
    return this.user.id === user_id;
  }

  public teams() {
    const teams = [];
    this.rights.forEach(el => {
      const data = el.split(':');
      if (data.length === 3) {
        if (data[0] == 'edit' && data[1] == 'team') {
          teams.push(data[2]);
        }
      }
    });

    return teams;
  }

  public isAdmin(): boolean {
    let access = false;
    this.rights.forEach(r => {
      if (r === 'admin') access = true;
    });
    return access;
  }

  public isTeamAdmin(team_id): boolean {
    let access = false;

    this.rights.forEach(r => {
      const rights = r.split(':');
      if (rights[2] && rights[2] === team_id) {
        access = true;
      }
    });

    return access;
  }
}
