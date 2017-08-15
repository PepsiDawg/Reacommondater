import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  animations: [
    trigger('cardState', [
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
export class CardsComponent implements OnInit {

  @Input() stats = {};
  categories = [];
  state = 'active';
  dropdown = true;

  constructor() { }

  ngOnInit() {
    for(let category in this.stats) {
      this.categories.push(category);
    }
    console.log(this.stats, this.categories);
  }

  toggleState() {
    this.state = this.state == 'active' ? 'inactive' : 'active';
    this.dropdown = !this.dropdown;
  }

}
