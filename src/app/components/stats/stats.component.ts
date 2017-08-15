import { Component, OnInit } from '@angular/core';
import { CardsComponent } from './components/cards/cards.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private firebase: FirebaseService) { }

  owProfile = {};
  owStats = {};
  loading = true;
  hasProfile = true;

  winPercent = "";
  drawPercent = "";
  losePercent = "";

  ngOnInit() {
    this.firebase.getUserProfile()
        .subscribe(result => {
          this.loading = true;
          if(result["accountName"]) {
            this.hasProfile = true;
            Observable.combineLatest(
              this.firebase.getUserOverwatchProfile(result["accountName"]),
              this.firebase.getUserOverwatchStats(result["accountName"])
            ).subscribe(result => {
              this.owProfile = result[0];
              this.owStats = result[1];
              this.loading = false;
              let record = this.owProfile["gameRecord"];

              this.winPercent = ((record.won / record.played) * 100) + "%";
              this.drawPercent = ((record.draw / record.played) * 100) + "%";
              this.losePercent = ((record.lost / record.played) * 100) + "%";
            });
          } else {
            this.loading = false;
            this.hasProfile = false;
          }
        });
  }
}
