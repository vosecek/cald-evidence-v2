import {Component, OnInit} from '@angular/core';
import {ApiProvider} from '../providers/api/api';
import {ExportService} from '../services/export.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-catcher-data',
  templateUrl: './catcher-data.page.html',
  styleUrls: ['./catcher-data.page.scss'],
})
export class CatcherDataPage implements OnInit {

  constructor(private api: ApiProvider, private ex: ExportService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('catcher data initialized');

    this.route.params.subscribe(pars => {

      this.ex.catcher(pars['type']).then(() => {

      }, err => {
        console.log(err);
      });
    });
  }

}
