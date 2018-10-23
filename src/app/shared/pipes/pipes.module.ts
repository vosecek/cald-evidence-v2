import {NgModule} from '@angular/core';
import {FilterPipe} from './filter';
import {OrderPipe} from './order';
import {DivisionPipe} from './division';
import {LeaguePipe} from './league';
import {TournamentDivisionsPipe} from './tournament-divisions';
import {ImplodePipe} from './implode';
import {TeamPipe} from './team.pipe';
import {PlayerPipe} from './player.pipe';
import {IncludesPipe} from './includes.pipe';
import {SexPipe} from './sex.pipe';
import {SearchPipe} from './search.pipe';
import {PlayerAtTeamPipe} from './player-at-team.pipe';

@NgModule({
  declarations: [FilterPipe,
    OrderPipe,
    DivisionPipe,
    TeamPipe,
    PlayerPipe,
    LeaguePipe,
    TournamentDivisionsPipe,
    ImplodePipe,
    IncludesPipe,
    SexPipe,
    SearchPipe,
    PlayerAtTeamPipe],
  imports: [],
  exports: [FilterPipe,
    OrderPipe,
    DivisionPipe,
    TeamPipe,
    PlayerPipe,
    LeaguePipe,
    SexPipe,
    TournamentDivisionsPipe,
    IncludesPipe,
    SearchPipe,
    PlayerAtTeamPipe,
    ImplodePipe]
})
export class PipesModule {
}
