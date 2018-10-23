import {Component, OnInit} from '@angular/core';
import {SeasonProvider} from '../providers/season/season';
import {ActivatedRoute} from '@angular/router';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.page.html',
  styleUrls: ['./seasons.page.scss'],
})
export class SeasonsPage implements OnInit {

  constructor(protected seasonProvider: SeasonProvider) {
  }

  ngOnInit() {
  }

  detail(data): void {

  }

}
