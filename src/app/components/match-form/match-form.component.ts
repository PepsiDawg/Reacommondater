import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {
  title = "Add a Match";
  group = ["PepsiDog", "Ash", "Lindle"];
  maps = [];
  edit = false;
  matchID = -1;
  match: any = {};
  modifiers = {
    leaver: {
      value: false,
      icon_true: "fa-suitcase negative",
      icon_false: "fa-home positive",
    },
    heated: {
      value: false,
      icon_true: "fa-fire-extinguisher negative",
      icon_false: "fa-snowflake-o positive"
    },
    communication: {
      value: true,
      icon_true: "fa-microphone positive",
      icon_false: "fa-microphone-slash negative"
    }
  }

  form: FormGroup;

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    fb: FormBuilder) { 
      this.form = fb.group({
        map: ['', Validators.required],
        outcome: ['', Validators.required],
        player_sr: ['', Validators.required]
      });
  }

  ngOnInit() {
    this.route.params.subscribe(result => {
      if(result["id"]) {
        this.matchID = result["id"];
        this.edit = true;
        this.title = "Edit Match";
        this.firebase.getUserMatch(this.matchID)
            .subscribe(result => {
              this.match = result;
              this.group = this.match.group;
              this.form.setValue({
                map: this.match.map,
                outcome: this.capitialize(this.match.outcome),
                player_sr: this.match.sr
              });

              this.modifiers.communication.value = this.match.modifiers.communication;
              this.modifiers.heated.value = this.match.modifiers.heated;
              this.modifiers.leaver.value = this.match.modifiers.leaver;
            });
        }
    });
  }

  addMatch() {
    let addMatch = this.getFormAsMatch();
    this.firebase.addUserMatch(addMatch);
    this.router.navigate(['graphs']);
  }

  editMatch() {
    let newMatch = this.getFormAsMatch();

    this.firebase.updateUserMatch(this.matchID, newMatch);

    if((this.match["outcome"] != newMatch["outcome"]) && (this.match["map"] == newMatch["map"])) {
      this.firebase.updateUserMapData(newMatch["map"], this.match["outcome"], newMatch["outcome"]);
    } else if(this.match["map"] != newMatch["map"]) {
      this.firebase.updateUserMapData(this.match["map"], this.match["outcome"], null);
      this.firebase.updateUserMapData(newMatch["map"], null, newMatch["outcome"]);
    }

    this.router.navigate(['matches']);
  }

  getFormAsMatch() {
    let inputs = this.form.value;
    let temp = {};
    
    temp["sr"] = inputs["player_sr"];
    temp["map"] = inputs["map"];
    temp["outcome"] = inputs["outcome"].toLowerCase();
    temp["group"] = this.group;
    temp["modifiers"] = {};
    temp["modifiers"]["leaver"] = this.modifiers.leaver.value;
    temp["modifiers"]["heated"] = this.modifiers.heated.value;
    temp["modifiers"]["communication"] = this.modifiers.communication.value;

    return temp;
  }

  addMember(value) {
    if(value != undefined && value != "") {
      this.group.push(value);
    }
  }

  deleteMember(index) {
    this.group.splice(index, 1);
  }

  getClasses(category) {
    return this.modifiers[category]['icon_' + this.modifiers[category].value];
  }

  toggleModifier(category) {
    this.modifiers[category].value = !this.modifiers[category].value;
  }

  capitialize(phrase) {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  }

}
