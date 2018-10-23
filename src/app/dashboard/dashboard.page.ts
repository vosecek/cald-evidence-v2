import {Component, OnInit} from '@angular/core';
import {AuthProvider} from '../providers/auth/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private authProvider: AuthProvider) {
  }

  ngOnInit() {
  }
}