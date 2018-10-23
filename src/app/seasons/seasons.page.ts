import {Component, OnInit} from '@angular/core';
import {SeasonProvider} from '../providers/season/season';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.page.html',
  styleUrls: ['./seasons.page.scss'],
})
export class SeasonsPage implements OnInit {

  constructor(public seasonProvider: SeasonProvider) {
  }

  ngOnInit() {
  }

  detail(data): void {

  }

}
