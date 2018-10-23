import {Component, OnInit} from '@angular/core';
import {UserProvider} from '../../providers/user/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IUser} from '../../interfaces/user';
import {ModalController} from '@ionic/angular';
import {AuthProvider} from '../../providers/auth/auth';
import {TeamProvider} from '../../providers/team/team';
import {ITeam} from '../../interfaces/team';
import {ApiProvider} from '../../providers/api/api';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {

  protected form: FormGroup;
  protected user: IUser;
  protected team: ITeam[];

  constructor(private userProvider: UserProvider, private api: ApiProvider, protected teamProvider: TeamProvider, private fb: FormBuilder, private modal: ModalController, protected auth: AuthProvider) {
    this.form = this.fb.group({
      id: [''],
      login: ['', [Validators.required]],
      email: ['', [Validators.required]],
      privileges: [''],
      password: ['']
    });
  }

  hasPrivilege(teamId): boolean {
    return !!this.user.privileges.find(p => p.entity_id === teamId);
  }

  save() {

    const data = this.form.value;
    if (!data['password'] || data['password'].length === 0) delete data['password'];

    if (!this.user) delete data['id'];

    this.userProvider.updateCreateItem(data).catch(err => console.log(err));
    if (this.user) {
      const original_ids = this.user.privileges.map(it => it.entity_id);

      const toDelete = original_ids.filter(item => this.form.value.privileges.indexOf(item) < 0);
      const toAdd = this.form.value.privileges.filter(item => original_ids.indexOf(item) < 0);

      toDelete.forEach(it => {
        this.api.delete('team/' + it + '/user/' + this.form.value.id, {'privilege': 'edit'}).subscribe(el => {
        });
      });

      toAdd.forEach(it => {
        this.api.post('team/' + it + '/user/' + this.form.value.id, {'privilege': 'edit'}).subscribe(el => {
        });
      });
    }
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  ngOnInit() {
    if (this.user) {
      console.log(this.user);
      this.form.patchValue({
        id: this.user.id,
        login: this.user.login,
        email: this.user.email
      });
    }
  }

}
