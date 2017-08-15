import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { routing } from './app.routing';

import { FirebaseService } from './services/firebase.service';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { GraphsComponent } from './components/graphs/graphs.component';
import { MatchFormComponent } from './components/match-form/match-form.component';
import { MatchesComponent } from './components/matches/matches.component';
import { AdminComponent } from './components/admin/admin.component';
import { StatsComponent } from './components/stats/stats.component';
import { CardsComponent } from './components/stats/components/cards/cards.component';
import { HeroesComponent } from './components/stats/components/heroes/heroes.component';
import { SrGraphComponent } from './components/graphs/components/sr-graph/sr-graph.component';
import { MapGraphComponent } from './components/graphs/components/map-graph/map-graph.component';
import { ChartsModule } from '../ng2-charts/ng2-charts';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    GraphsComponent,
    MatchFormComponent,
    MatchesComponent,
    AdminComponent,
    StatsComponent,
    CardsComponent,
    HeroesComponent,
    SrGraphComponent,
    MapGraphComponent,
    DropdownComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    routing,
    ChartsModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
