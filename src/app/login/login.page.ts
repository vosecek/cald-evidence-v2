import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiProvider} from '../providers/api/api';
import {LoadingController, ToastController} from '@ionic/angular';
import {AuthProvider} from '../providers/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';

import {Plugins} from '@capacitor/core';

const {SplashScreen} = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public form: FormGroup;

  constructor(private fb: FormBuilder,
              private api: ApiProvider,
              private router: Router,
              private storage: Storage,
              private activatedRoute: ActivatedRoute,
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController,
              private authProvider: AuthProvider) {
    this.form = this.fb.group({
      'login': ['', Validators.required],
      'password': ['', Validators.required],
      'remember': [true]
    });

    this.storage.get('auth').then(data => {
      if (data) {
        if (data['remember']) {
          this.form.patchValue({login: data['login'], password: data['password']});
          this.submit().then(() => {

          }, err => {
            console.log(err);
          });
        }
      }
    }, err => {
      console.log(err);
    });
  }

  public keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.submit().catch(err => console.log(err));
    }
  }

  anonymous() {
    this.form.patchValue({login: 'public', password: 'access', remember: false});
    this.submit(true).catch(err => console.log(err));
  }

  async submit(anonymous?: boolean) {
    anonymous = anonymous || false;
    const load = await this.loadCtrl.create();
    load.present().catch(err => console.log(err));

    this.activatedRoute.params.subscribe(pars => {
      if (pars['develop'] && pars['develop'] == 'develop') this.api.isDevelop = true;
      this.authProvider.login(this.form.value).then(() => {
        if (this.form.value.remember) {
          this.storage.set('auth', this.form.value).then(() => {

          }, err => {

          });
        }
        this.router.navigate([(anonymous ? 'seasons' : 'dashboard')]).then(() => {
          return load.dismiss();
        }, err => {
          console.log(err);
          return load.dismiss();
        });
      }, async err => {
        load.dismiss().catch(err => console.log(err));
        const toast = await this.toastCtrl.create({message: err, duration: 3000});
        return toast.present();
      });
    }, err => {
      console.log(err);
      return load.dismiss();
    });
  }

  ionViewDidEnter() {
    SplashScreen.hide().catch(err => console.log(err));
  }

  ionViewDidLoad() {

  }
}
