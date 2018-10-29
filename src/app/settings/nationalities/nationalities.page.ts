import {Component, OnInit} from '@angular/core';
import {NationalityProvider} from '../../providers/nationality/nationality';
import {INationality} from '../../interfaces/nationality';
import {ModalController} from '@ionic/angular';
import {NationalityEditPage} from './nationality-edit/nationality-edit.page';

@Component({
  selector: 'app-nationalities',
  templateUrl: './nationalities.page.html',
  styleUrls: ['./nationalities.page.scss'],
})
export class NationalitiesPage implements OnInit {

  constructor(
    public nationalityProvider: NationalityProvider,
    private modal: ModalController
  ) {
  }


  async detail(nationality: INationality) {
    const modal = await this.modal.create({
      componentProps: {nationality: nationality},
      component: NationalityEditPage
    });

    modal.onDidDismiss().then(() => {
      this.nationalityProvider.load({}, false, true).catch(err => console.log(err));
    });

    return modal.present();
  }

  ngOnInit() {

  }

}
