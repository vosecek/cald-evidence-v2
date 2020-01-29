import {Component, OnInit} from '@angular/core';
import {ExportService} from '../../services/export.service';
import {SeasonProvider} from '../../providers/season/season';
import {ISeason} from '../../interfaces/season';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  public seasonToExport: ISeason = null;
  public team = false;

  constructor(
    public seasonService: SeasonProvider,
    public exportService: ExportService
  ) {
  }

  ngOnInit(): void {
  }

  export() {
    this.exportService.rejstrikSportu(null, this.seasonToExport, this.team).then(() => {
    }, err => {
      console.log(err);
    });
  }
}
