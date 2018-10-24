import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiProvider} from '../providers/api/api';
import {LoadingController, ToastController} from '@ionic/angular';
import {AuthProvider} from '../providers/auth/auth';
import {Router} from '@angular/router';

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
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController,
              private authProvider: AuthProvider) {
    this.form = this.fb.group({
      'login': ['', Validators.required],
      'password': ['', Validators.required]
    });

    this.form.patchValue({login: '', password: ''});
  }

  async submit() {

    const load = await this.loadCtrl.create();
    load.present().catch(err => console.log(err));

    this.authProvider.login(this.form.value).then(() => {
      this.router.navigate(['dashboard']).catch(err => console.log(err));
      return load.dismiss();
    }, async err => {
      load.dismiss().catch(err => console.log(err));
      const toast = await this.toastCtrl.create({message: err, duration: 3000});
      return toast.present();
    });
  }

  ionViewDidLoad() {

  }
}
