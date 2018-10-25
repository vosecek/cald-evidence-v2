import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiProvider} from '../providers/api/api';
import {LoadingController, ToastController} from '@ionic/angular';
import {AuthProvider} from '../providers/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';

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
              private activatedRoute: ActivatedRoute,
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController,
              private authProvider: AuthProvider) {
    this.form = this.fb.group({
      'login': ['', Validators.required],
      'password': ['', Validators.required]
    });

    this.form.patchValue({login: '', password: ''});
  }

  public keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.submit().catch(err => console.log(err));
    }
  }

  async submit() {

    const load = await this.loadCtrl.create();
    load.present().catch(err => console.log(err));

    this.activatedRoute.params.subscribe(pars => {
      console.log(pars);
      if (pars['develop'] && pars['develop'] == 'develop') this.api.isDevelop = true;
      this.authProvider.login(this.form.value).then(() => {
        this.router.navigate(['dashboard']).then(() => {
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

  ionViewDidLoad() {

  }
}
