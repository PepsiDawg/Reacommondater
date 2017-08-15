import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class FirebaseService {
  private userUID;
  private SEASON_PATH = "";
  private DATA_PATH = "";
  private OW_STATS_PATH = "https://ow-stats.herokuapp.com/stats/pc/us/";
  private OW_PROFILE_PATH = "https://ow-stats.herokuapp.com/profile/pc/us/";
  private currentSeason = -1;
  private profile = {};
  private trackedSeasons = [];
  private matches = [];
  private mapData = [];
  private maps = [
    "Dorado",
    "Eichenwalde",
    "Hanamura",
    "Hollywood",
    "Horizon Lunar Colony",
    "Illios",
    "King's Row",
    "Lijiang Tower",
    "Nepal",
    "Numbani",
    "Oasis",
    "Route 66",
    "Temple of Anubis",
    "Volskaya Industries",
    "Watchpoin: Gibraltar"
  ]

  private currentSeasonSubscription;
  private trackedSeasonSubscription;
  private profileSubscription;
  private matchesSubscription;
  private mapDataSubscription;

  loggedIn = false;
  username = "";

  constructor(private database: AngularFireDatabase, private auth: AngularFireAuth, private http: Http) { 
    this.auth.authState.subscribe(result => {
      if(result) {
        this.userUID = result.uid;
        this.loggedIn = true;
        this.username = result.displayName;

        this.DATA_PATH = 'users/' + this.userUID + '/data';
        this.currentSeasonSubscription = this.database.object(this.DATA_PATH + '/current_season')
            .subscribe(result => {
              this.SEASON_PATH = this.DATA_PATH + '/season_' + result.$value;
              this.currentSeason = result.$value;

              this.matchesSubscription = this.database.list(this.SEASON_PATH + '/matches')
                  .subscribe(result => {
                    this.matches = result;
                  });
              this.mapDataSubscription = this.database.object(this.SEASON_PATH + '/maps')
                  .subscribe(result => {
                    this.mapData = result;
                  })
            });
        this.trackedSeasonSubscription = this.database.list(this.DATA_PATH + '/tracked_seasons')
            .subscribe(result => {
              for(let el of result) {
                this.trackedSeasons.push(el.$value);
              }
            });
        this.profileSubscription = this.database.object('users/' + this.userUID + '/profile')
            .subscribe(result => {
              this.profile = result;
            });
      } else {
        if(this.currentSeasonSubscription) {
          this.currentSeasonSubscription.unsubscribe();
          this.currentSeasonSubscription = null;
          this.trackedSeasonSubscription.unsubscribe();
          this.trackedSeasonSubscription = null;
          this.profileSubscription.unsubscribe();
          this.profileSubscription = null;
          this.matchesSubscription.unsubscribe();
          this.matchesSubscription = null;
          this.mapDataSubscription.unsubscribe();
          this.mapDataSubscription = null;
          this.loggedIn = false;
          this.username = "";
        }
      }
    });
  }

  login() {
    return this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(result => {
            let user = {
              name: result.user.displayName,
              email: result.user.email,
              accountName: "",
              timestamp: new Date()
            }

            this.userUID = result.user.uid;
            this.addUser(this.userUID, user);
          });
  }

  logout() {
    this.userUID = null;
    return this.auth.auth.signOut();
  }

  private addUser(id: string, user: any) {
    this.database
    this.database.object("users/" + id + "/profile").take(1)
    .subscribe(result => {
      if(result.hasOwnProperty('$value') && result.$value == null) {
        this.database.object("users/" + id + "/profile").set(user);
        this.getGlobalSeason()
            .subscribe(result => {
              let season = result.$value;
              this.setupSeason(season);
              this.setUserCurrentSeason(season);
              this.setUserTrackedSeasons([season]);
            });
      }
    });
  }

  getLoggedInStatus() {
    return Observable.interval(250)
      .map(() => {
        return new Object({
          loggedIn: this.loggedIn,
          name: this.username
        });
      }).distinctUntilChanged();
  }

  getUserProfile() {
    return Observable.interval(250).map(() => this.profile).distinctUntilChanged();
  }

  getUserMatch(key) {
    return this.database.object(this.SEASON_PATH + '/matches/' + key).take(1);
  }

  getUserMatches() {
    return Observable.interval(250).map(() => this.matches).distinctUntilChanged();
  }

  getUserMapData() {
     return Observable.interval(250).map(() => this.mapData).distinctUntilChanged();
  }

  getUserPlayingGroup() {
     return this.database.object(this.DATA_PATH + '/group');
  }

  getUserTrackedSeasons() {
    return Observable.interval(250).map(() => this.trackedSeasons).distinctUntilChanged();
  }

  getUserCurrentSeason() {
    return Observable.interval(250).map(() => this.currentSeason).distinctUntilChanged();
  }

  getGlobalSeason() {
    return this.database.object('global_season').take(1);
  }

  getUserOverwatchProfile(id) {
    return this.http.get(this.OW_PROFILE_PATH + this.profile['accountName'].replace('#', '-'))
               .map(result => {
                 let ow_profile = result.json();
                 return new Object({
                    username: ow_profile.username,
                    level: ow_profile.level,
                    levelFrame: ow_profile.levelFrame,
                    levelStars: ow_profile.star,
                    gameRecord: ow_profile.games.competitive,
                    rank: ow_profile.competitive.rank,
                    rankIcon: ow_profile.competitive.rank_img
                 });
               });
  }

  getUserOverwatchStats(id) {
    return this.http.get(this.OW_STATS_PATH + this.profile['accountName'].replace('#', '-'))
               .map(result => {
                 let stats = result.json();

                 return new Object({
                   username: stats.username,
                   level: stats.level,
                   categories: {
                     Assists: stats.stats.assists.competitive,
                     Average: stats.stats.average.competitive,
                     Best: stats.stats.best.competitive,
                     Combat: stats.stats.combat.competitive,
                     Deaths: stats.stats.deaths.competitive,
                     Game: stats.stats.game.competitive,
                     Match_Awards: stats.stats.match_awards.competitive,
                     Miscellaneous: stats.stats.miscellaneous.competitive
                   },
                   heroes: stats.stats.top_heroes.competitive
                 });
               });
  }

  setUserTrackedSeasons(seasons) {
    this.database.object(this.DATA_PATH + '/tracked_seasons').set(seasons);
  }

  setUserPlayingGroup(players) {
    this.database.object(this.DATA_PATH + '/group').set(players);
  }

  deleteUserMatch(match) {
    this.database.object(this.SEASON_PATH + '/matches/' + match.$key).remove();
    this.database.object(this.SEASON_PATH + '/maps/' + match.map).take(1)
        .subscribe(result => {
          let values = result;
          values[match.outcome] -= 1;
          
          this.database.object(this.SEASON_PATH + '/maps/' + match.map).update(values);
        });
  }

  addUserMatch(match) {
    this.database.list(this.SEASON_PATH + '/matches').push(match);
    this.database.object(this.SEASON_PATH + '/maps/' + match.map).take(1)
        .subscribe(result => {
          let values = result;
          values[match.outcome] += 1;
          
          this.database.object(this.SEASON_PATH + '/maps/' + match.map).update(values);
        });
  }

  setUserCurrentSeason(season) {
    this.database.object(this.DATA_PATH + '/current_season').set(season);
  }

  updateUserMatch(key, match) {
    this.database.object(this.SEASON_PATH + '/matches/' + key).update(match);
  }

  updateUserMapData(map, oldOutcom, newOutcome) {
    this.database.object(this.SEASON_PATH + '/maps/' + map).take(1)
        .subscribe(result => {
          let temp = result;

          if(oldOutcom) {
            temp[oldOutcom] -= 1;
          }
          if(newOutcome) {
            temp[newOutcome] += 1;
          }
          this.database.object(this.SEASON_PATH + '/maps/' + map).update(temp);
        });
  }

  updateUserProfile(profile) {
    this.database.object('users/' + this.userUID + '/profile').update(profile);
  }

  changeUserSeason(season) {
    this.database.object(this.DATA_PATH + '/season_' + season)
        .take(1)
        .subscribe(result => {
          console.log(result, result.hasOwnProperty('$value'));
          if(result.hasOwnProperty('$value') && result.$value == null) {
            this.setupSeason(season);
            alert("New season created!");
          } else {
            this.setUserCurrentSeason(season);
          }
        });
  }

  setupSeason(season) {
    let base = "users/" + this.userUID + "/data/season_" + season;
    this.database.object(base)
        .take(1)
        .subscribe(result => {
          if(!result.$value) {
            this.database.object(base + "/maps").set(this.setupMapData());
            this.setUserCurrentSeason(season);
          }
        });
  }

  private setupMapData() {
    let temp = {};

    this.maps.forEach(item => {
      temp[item] = {
        won: 0,
        draw: 0,
        lost: 0
      };
    });

    return temp;
  }
}
