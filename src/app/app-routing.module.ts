import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoggedGuard} from './guards/logged.guard';
import {SeasonsGuard} from './guards/seasons.guard';
import {SeasonDetailGuard} from './guards/season-detail.guard';
import {TeamsGuard} from './guards/teams.guard';
import {AdminGuard} from './guards/admin.guard';

const routes: Routes = [
  {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  {path: 'login/:develop', loadChildren: './login/login.module#LoginPageModule'},
  {
    path: '',
    canActivate: [LoggedGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule', canActivate: []},
      {path: 'seasons', loadChildren: './seasons/seasons.module#SeasonsPageModule', canActivate: [SeasonsGuard]},
      {
        path: 'seasons/:season',
        loadChildren: './seasons/season-detail/season-detail.module#SeasonDetailPageModule',
        canActivate: [SeasonDetailGuard]
      },
      {
        path: 'seasons/:season/:tournament',
        loadChildren: './seasons/season-detail/tournament/tournament.module#TournamentPageModule',
        canActivate: [TeamsGuard]
      },
      {path: 'teams', loadChildren: './teams/teams.module#TeamsPageModule'},
      {path: 'teams/:team', loadChildren: './teams/team-detail/team-detail.module#TeamDetailPageModule'},
      {path: 'player', loadChildren: './teams/team-detail/player/player.module#PlayerPageModule'},
      {path: 'users', loadChildren: './users/users.module#UsersPageModule'},
      {path: 'user-edit', loadChildren: './users/user-edit/user-edit.module#UserEditPageModule'},
      {
        path: 'tournament-edit',
        loadChildren: './seasons/season-detail/tournament/tournament-edit/tournament-edit.module#TournamentEditPageModule'
      },
      {path: 'team-edit', loadChildren: './teams/team-edit/team-edit.module#TeamEditPageModule'},
      {
        path: '',
        canActivate: [AdminGuard],
        children: [
          {path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule'},
          {path: 'settings/fees', loadChildren: './settings/fees/fees.module#FeesPageModule'},
          {path: 'settings/nationalities', loadChildren: './settings/nationalities/nationalities.module#NationalitiesPageModule'},
          {path: 'settings/export', loadChildren: './settings/export/export.module#ExportPageModule'}
        ]
      }
    ]
  },
  {path: 'player-history', loadChildren: './teams/team-detail/player/player-history/player-history.module#PlayerHistoryPageModule'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
