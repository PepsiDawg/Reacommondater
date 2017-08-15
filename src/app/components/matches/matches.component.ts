import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  matches = [];

  modifiers = {
    leaver: {
      icon_true: "fa-suitcase negative",
      icon_false: "fa-home positive",
    },
    heated: {
      icon_true: "fa-fire-extinguisher negative",
      icon_false: "fa-snowflake-o positive"
    },
    communication: {
      icon_true: "fa-microphone positive",
      icon_false: "fa-microphone-slash negative"
    }
  }

  constructor(private firebase: FirebaseService, private router: Router) { }

  ngOnInit() {
    this.firebase.getUserMatches()
        .subscribe(result => {
          this.matches = result;
        });
  }

  getClasses(modifier, value) {
    return this.modifiers[modifier]['icon_' + value];
  }

  editMatch(index) {
    this.router.navigate(['matches/edit/', this.matches[index].$key]);
  }

  deleteMatch(index) {
    this.firebase.deleteUserMatch(this.matches[index]);
  }

}
