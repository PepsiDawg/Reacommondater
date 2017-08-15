import { Router, RouterModule } from '@angular/router';

import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { GraphsComponent } from './components/graphs/graphs.component';
import { MatchFormComponent } from './components/match-form/match-form.component';
import { MatchesComponent } from './components/matches/matches.component';
import { StatsComponent } from './components/stats/stats.component';

export const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'settings', component: AdminComponent },
    { path: 'graphs', component: GraphsComponent },
    { path: 'matches', component: MatchesComponent },
    { path: 'matches/new', component: MatchFormComponent },
    { path: 'matches/edit/:id', component: MatchFormComponent },
    { path: 'stats', component: StatsComponent }
]);