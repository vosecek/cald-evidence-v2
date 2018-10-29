import {Component, OnInit} from '@angular/core';
import {FeeProvider} from '../../providers/fee/fee';
import {SeasonEditPage} from '../../seasons/season-edit/season-edit.page';
import {ModalController} from '@ionic/angular';
import {AuthProvider} from '../../providers/auth/auth';
import {FeeEditPage} from './fee-edit/fee-edit.page';
import {IFee} from '../../interfaces/fee';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.page.html',
  styleUrls: ['./fees.page.scss'],
})
export class FeesPage implements OnInit {

  constructor(public feeProvider: FeeProvider, public auth: AuthProvider, private modal: ModalController) {
  }

  ngOnInit() {
    this.feeProvider.load().catch(err => console.log(err));
  }

  async addItem(item: IFee) {
    const modal = await this.modal.create({
      component: FeeEditPage,
      componentProps: {fee: item}
    });

    return modal.present();
  }

}
