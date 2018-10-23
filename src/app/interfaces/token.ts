import * as moment from 'moment';

export class Token {
  private _id: string;
  private _token: string;
  private _type: string;
  private _user_id: string;
  private _valid_until: string;

  constructor(data) {
    if (data) {
      if (data['id']) this._id = data['id'];
      if (data['token']) this._token = data['token'];
      if (data['type']) this._type = data['type'];
      if (data['user_id']) this._user_id = data['user_id'];
      if (data['valid_until']) this._valid_until = data['valid_until'];
    }
  }

  get id(): string {
    return this._id;
  }

  get token(): string {
    return this._token;
  }

  get type(): string {
    return this._type;
  }

  get user_id(): string {
    return this._user_id;
  }

  get valid_until(): string {
    return this._valid_until;
  }

  isValid(): boolean {
    let time = moment();
    let validity = moment(this.valid_until);
    return true;
    // return (time < validity);
  }
}
