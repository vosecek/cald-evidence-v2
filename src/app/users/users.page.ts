import {Component, OnInit} from '@angular/core';
import {UserProvider} from '../providers/user/user';
import {ModalController} from '@ionic/angular';
import {IUser} from '../interfaces/user';
import {UserEditPage} from './user-edit/user-edit.page';
import {TeamProvider} from '../providers/team/team';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  constructor(public userProvider: UserProvider, private modal: ModalController, private teamProvider: TeamProvider) {
  }

  async openEditUser(user?: IUser) {
    const modal = await this.modal.create({component: UserEditPage, componentProps: {user: user}});
    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });
    return modal.present();
  }

  ngOnInit() {
    this.teamProvider.load().catch(err => console.log(err));
    this.userProvider.load({}, true).catch(err => console.log(err));
  }

}
