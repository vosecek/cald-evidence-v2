import {Component, OnInit} from '@angular/core';
import {ExportService} from '../../services/export.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  constructor(
    public exportService: ExportService
  ) {
  }

  ngOnInit(): void {
  }
}
