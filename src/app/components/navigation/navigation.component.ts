import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private loggedIn = false;
  private username = "";
  private currentSeason = -1;

  constructor(private firebase: FirebaseService) { }

  ngOnInit() {
    Observable.combineLatest(
      this.firebase.getLoggedInStatus(),
      this.firebase.getUserCurrentSeason()
    ).subscribe((result: any) => {
      this.currentSeason = result[1];
      this.loggedIn = result[0].loggedIn;
      this.username = result[0].name;
    });
  }

}
