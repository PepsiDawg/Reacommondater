import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  edit = {
    overwatch_account: false,
    current_season: false
  };

  profile = {};
  currentSeason = -1;
  trackedSeasons = [];
  loading = true;

  constructor(private firebase: FirebaseService) { 

  }

  ngOnInit() {
    Observable.combineLatest(
      this.firebase.getUserProfile(),
      this.firebase.getUserCurrentSeason(),
      this.firebase.getUserTrackedSeasons()
    ).subscribe(result => {
      this.loading = true;
      this.profile = result[0];
      this.currentSeason = result[1];
      this.trackedSeasons = result[2];
      this.loading = false;
    });
  }

  saveAccountName(value) {
    this.profile['accountName'] = value;
    this.edit.overwatch_account = false;
    this.firebase.updateUserProfile(this.profile);
  }

  saveCurrentSeason(value) {
    let season = parseInt(value);
    this.firebase.changeUserSeason(season);
    if(!this.trackedSeasons.includes(season)) {
      this.trackedSeasons.push(season);
      this.firebase.setUserTrackedSeasons(this.trackedSeasons);
    }
    this.edit.current_season = false;
  }
}
