import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiProvider} from '../providers/api/api';
import {ToastController} from '@ionic/angular';
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
              private toastCtrl: ToastController,
              private authProvider: AuthProvider) {
    this.form = this.fb.group({
      'login': ['', Validators.required],
      'password': ['', Validators.required]
    });

    this.form.patchValue({login: '', password: ''});
  }

  submit(): void {
    this.authProvider.login(this.form.value).then(() => {
      this.router.navigate(['dashboard']).catch(err => console.log(err));
    }, err => {
      const toast = this.toastCtrl.create({message: err, duration: 3000});
      console.log(toast);
    });
  }

  ionViewDidLoad() {

  }
}
