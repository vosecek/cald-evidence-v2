import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, RouteReuseStrategy, Routes} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {IonicStorageModule} from '@ionic/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {SeasonProvider} from './providers/season/season';
import {GeneralProvider} from './providers/general/general';
import {AuthProvider} from './providers/auth/auth';
import {ApiProvider} from './providers/api/api';
import {TeamProvider} from './providers/team/team';
import {TournamentProvider} from './providers/tournament/tournament';
import {DivisionProvider} from './providers/division/division';
import {LeagueProvider} from './providers/league/league';
import {TournamentBelongsToLeagueAndDivisionProvider} from './providers/tournament-belongs-to-league-and-division/tournament-belongs-to-league-and-division';
import {PlayerProvider} from './providers/player/player';
import {PlayerAtTeamProvider} from './providers/player-at-team/player-at-team';
import {RosterProvider} from './providers/roster/roster';
import {PlayerAtRosterProvider} from './providers/player-at-roster/player-at-roster';
import {LOCALE_ID} from '@angular/core';

import {registerLocaleData} from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import {NationalityProvider} from './providers/nationality/nationality';
import {PlayerPage} from './teams/team-detail/player/player.page';
import {PipesModule} from './shared/pipes/pipes.module';
import {TournamentEditPage} from './seasons/season-detail/tournament/tournament-edit/tournament-edit.page';
import {TeamEditPage} from './teams/team-edit/team-edit.page';
import {UserProvider} from './providers/user/user';
import {UserEditPage} from './users/user-edit/user-edit.page';

registerLocaleData(localeCs, 'cs-CZ');

@NgModule({
  declarations: [AppComponent, PlayerPage, TournamentEditPage, TeamEditPage, UserEditPage],
  entryComponents: [PlayerPage, TournamentEditPage, TeamEditPage, UserEditPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    PipesModule,
    CommonModule,
    IonicModule.forRoot({
      backButtonText: ''
    }),
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    UserProvider,
    GeneralProvider,
    AuthProvider,
    ApiProvider,
    TeamProvider,
    GeneralProvider,
    TournamentProvider,
    SeasonProvider,
    DivisionProvider,
    NationalityProvider,
    LeagueProvider,
    TournamentBelongsToLeagueAndDivisionProvider,
    PlayerProvider,
    PlayerAtTeamProvider,
    RosterProvider,
    PlayerAtRosterProvider,
    SplashScreen,
    {provide: LOCALE_ID, useValue: 'cs-CZ'},
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
