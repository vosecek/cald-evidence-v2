import {Component} from '@angular/core';

import {Events, MenuController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthProvider} from './providers/auth/auth';
import {ApiProvider} from './providers/api/api';

const moment = require('moment-timezone');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home'
    },
    {
      title: 'Turnaje',
      url: '/seasons',
      icon: 'list'
    },
    {
      title: 'Uživatelé',
      url: '/users',
      icon: 'people'
    },
    {
      title: 'Tymy',
      url: '/teams',
      icon: 'walk'
    }
  ];

  constructor(
    public auth: AuthProvider,
    private platform: Platform,
    private api: ApiProvider,
    private events: Events,
    private menu: MenuController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  logout() {
    this.menu.close().catch(err => console.log(err));
    this.api.logout();
  }

  initializeApp() {
    moment.tz.setDefault('Europe/Prague');
    this.platform.ready().then(() => {
      this.events.subscribe('user:login', () => {
        if (this.auth.user.isAdmin()) {
          if (!this.appPages.find(it => it['url'] === '/settings')) {
            this.appPages.push({
              title: 'Nastavení',
              url: '/settings',
              icon: 'settings'
            });
          }
        }
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
