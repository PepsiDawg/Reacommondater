import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { NavigationComponent } from './components/navigation/navigation.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private firebase: FirebaseService) {}

  login() {
    this.firebase.login();
  }

  logout() {
    this.firebase.logout();
  }

  setupSeason() {
    this.firebase.setupSeason(4);
  }

  updateMD() {
    this.firebase.updateUserMapData("Hanamura", "lost", "won");
  }
}
