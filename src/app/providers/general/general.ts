import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {LoadingController, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralProvider {
  get data(): any[] {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  protected code: string;
  protected isAdmin: boolean;
  protected updatePut: boolean;

  private _data: any[] = [];
  protected loadedFully = false;

  constructor(public api: ApiProvider) {

  }

  public removeItem(id: any): Promise<any> {
    const pars = [];
    if (this.isAdmin) pars.push('admin');
    pars.push(this.code);
    pars.push(id.toString());

    return new Promise<any>((resolve, reject) => {
      this.api.delete(pars.join('/')).then(async () => {
        const toast = await new ToastController().create({message: 'Odstraněno', duration: 2000});
        toast.present().catch(err => console.log(err));
        const item = this.data.find(it => it.id === id);
        if (item) {
          this.data.splice(this.data.indexOf(item), 1);
        }
        resolve();
      }, err => {
        reject(err);
      });
    });

  }

  public dataByMaster(master: string, id: string): any[] {
    return this.data.filter(it => it[master] === id);
  }

  public loadDataByMaster(master: string, id: string, filter?: {}, extend?: boolean): Promise<any[]> {
    const pars = filter || {};
    extend = extend || false;
    return new Promise<any>((resolve, reject) => {
      pars[master] = id;
      this.load(pars, extend).then(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  load(filter?: {}, extend?: boolean): Promise<any> {
    extend = extend || false;
    if (!filter) {
      filter = null;
    }
    return new Promise<any>((resolve, reject) => {
      if (this.data.length === 0 || filter || !this.loadedFully) {
        if (!filter) {
          this.data = [];
        }
        this.api.get('list/' + this.code, {'filter': filter, 'extend': (extend ? 1 : 0)}).then(data => {
          if (!filter) this.loadedFully = true;
          data.forEach((it, key) => {
            const origin = this.data.find(item => item.id === it.id);
            if (origin) {
              this.data.splice(this.data.indexOf(origin), 1);
            }
            this.data.push(it);

            if (data.filter(el => el.id === it.id).length > 1) {
              data.splice(key, 1);
            }
          });

          resolve(data);
        }, err => {
          reject(err);
        });
      } else {
        resolve(this.data);
      }
    });
  }

  public getById(id): any {
    return this.data.find(it => it.id == id);
  }

  public findById(id, forceLoad?: boolean): Promise<any> {
    forceLoad = forceLoad || false;
    return new Promise<any>((resolve, reject) => {
      const data = this.data.find(it => it.id == id);
      if (data && !forceLoad) {
        resolve(data);
      } else {
        this.api.get('list/' + this.code, {filter: {id: id}}).then((data: any[]) => {
          if (data && data.length > 0) {
            data.forEach(it => {
              if (!this.data.find(el => el.id == it.id)) {
                this.data.push(it);
              }
            });
            resolve(data[0]);
          } else {
            reject();
          }
        }, err => {
          reject(err);
        });
      }
    });
  }

  public updateCreateItem(data: any): Promise<any> {
    const id = data['id'] || null;

    return new Promise<any>((resolve, reject) => {
      new Promise<any>((resolve, reject) => {
        const pars = [];
        if (this.isAdmin && (this.code !== 'user' || id)) pars.push('admin');
        pars.push(this.code);
        if (id) {
          pars.push(id.toString());
        }

        if (this.updatePut && id) {
          this.api.put(pars.join('/'), data).then(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
        } else {
          this.api.post(pars.join('/'), data).then(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
        }
      }).then(async response => {
        const toast = await new ToastController().create({message: (id ? 'Aktualizováno' : 'Vytvořeno'), duration: 2000});
        toast.present().catch(err => console.log(err));
        if (data['id']) {
          const item = this.data.find(it => it.id === response.id);
          if (item) {
            this.data[this.data.indexOf(item)] = response;
          }
        }
        if (response['id']) {
          this.data.push(response);
        }

        resolve(response);
      }, err => {
        reject(err);
      });
    });
  }

  public isLoaded(): boolean {
    return !!this.data;
  }

}
