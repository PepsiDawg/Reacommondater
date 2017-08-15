import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  spray_src: string;
  loggedIn = false;

  constructor(private firebase: FirebaseService) { 
    this.spray_src = this.getRandomSpray();
  }

  ngOnInit() {
    this.firebase.getLoggedInStatus()
        .subscribe((result: any) => {
          this.loggedIn = result.loggedIn;
        });
  }

  getRandomSpray() {
    let base = "../../assets/sprays/";
    let spray = Math.floor(Math.random() * 25);
    return base + spray + ".png";
  }

  login() {
    this.firebase.login();
  }

  logout() {
    this.firebase.logout();
  }

}
