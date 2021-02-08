import {Component, OnInit} from '@angular/core';
import {INationality} from '../../../interfaces/nationality';
import {AlertController, ModalController} from '@ionic/angular';
import {NationalityProvider} from '../../../providers/nationality/nationality';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-nationality-edit',
  templateUrl: './nationality-edit.page.html',
  styleUrls: ['./nationality-edit.page.scss'],
})
export class NationalityEditPage implements OnInit {

  public nationality: INationality;
  public form: FormGroup;

  constructor(
    private modal: ModalController,
    private fb: FormBuilder,
    private alertController: AlertController,
    private nationalityProvider: NationalityProvider
  ) {
    this.form = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      iso_code: ['', [Validators.required]],
      country_name: ['', [Validators.required]]
    });
  }

  dismiss() {
    this.modal.dismiss().catch(err => console.log(err));
  }

  save() {
    this.nationalityProvider.updateCreateItem(this.form.value).then(() => {
      this.dismiss();
    }, err => {
      console.log(err);
    });
  }

  async remove() {
    const self = this;
    const alert = await this.alertController.create({
      header: 'Potvrdit smazání',
      message: 'Opravdu smazat národnost?',
      buttons: [
        {
          role: 'cancel',
          text: 'Zpět'
        },
        {
          text: 'Smazat',
          handler: () => {
            self.nationalityProvider.removeItem(self.nationality.id).then(() => {
              self.dismiss();
            }, err => {
              console.log(err);
            });
          }
        }
      ]
    });
  }

  ngOnInit() {
    if (this.nationality) {
      this.form.patchValue({
        id: this.nationality.id,
        name: this.nationality.name,
        iso_code: this.nationality.iso_code,
        country_name: this.nationality.country_name
      });
    }
  }

}
