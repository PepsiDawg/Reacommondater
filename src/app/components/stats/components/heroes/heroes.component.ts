import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        overflow: 'hidden',
        height: '0px',
      })),
      state('active', style({
        overflow: 'hidden',
        height: '*',
      })),
      transition('inactive => active', animate('1000ms ease-in-out')),
      transition('active => inactive', animate('1000ms ease-in-out'))
    ])
  ]
})
export class HeroesComponent implements OnInit {
  dropdown = true;
  @Input() heroData = []
  maxHours = 0;

  state = 'active';

  heroColors = {
    ana: "#7088B4",
    bastion: "#7C8F7C",
    "d.va": "#EE91C8",
    doomfist: "#766B69",
    genji: "#97F144",
    hanzo: "#BAB58B",
    junkrat: "#ECBE4F",
    "lúcio": "#83CA4A",
    mccree: "#B05A5D",
    mei: "#71ABEA",
    mercy: "#EEEABA",
    orisa: "#468C44",
    pharah: "#3D7CC9",
    reaper: "#7D4052",
    reinhardt: "#96A1A5",
    roadhog: "#B68C50",
    "soldier: 76": "#697993",
    sombra: "#725ABA",
    symmetra: "#90BECE",
    "torbjörn": "#BF756A",
    tracer: "#D79541",
    widowmaker: "#9E6BA6",
    winston: "#A1A6BC",
    zarya: "#EB7FB9",
    zenyatta: "#EDE97D",
  }


  constructor() { }

  ngOnInit() {
    for(let hero of this.heroData) {
      let playtime = hero.played.split(' ');
      if(playtime.length == 1) {
        hero['hours'] = 0;
      } else {
        switch(playtime[1]) {
          case 'hours':
            hero['hours'] = playtime[0];
            break;
          case 'minute':
          case 'minutes':
            hero['hours'] = playtime[0] / 60;
            break;
          case 'seconds':
            hero['hours'] = playtime[0] / 3600;
            break;
          default: 
            hero['hours'] = 0;
        }
      }
    }
    this.maxHours = this.heroData[0].hours;
  }

  toggleState() {
    this.state = this.state == 'active' ? 'inactive' : 'active';
    this.dropdown = !this.dropdown;
  }

  setColor(hero) {
    let style = {
      'background-colo': this.heroColors[hero.toLowerCase()]
    };

    return style;
  }

}
