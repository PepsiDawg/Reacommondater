import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  animations: [
    trigger('dropdownState', [
      state('inactive', style({
        overflow: 'hidden',
        height: '0px',
      })),
      state('active', style({
        overflow: 'hidden',
        height: '*',
      })),
      transition('inactive => active', animate('300ms ease-in-out')),
      transition('active => inactive', animate('300ms ease-in-out'))
    ])
  ]
})
export class DropdownComponent implements OnInit {

  @Input() options;
  @Output() selected = new EventEmitter<any>();
  current;
  selectItem = false;
  state = "inactive";

  constructor() { }

  ngOnInit() {
    if(this.options.length > 0) {
      this.current = this.options[0];
    }
  }

  select(item) {
    if(this.current != item) {
      this.current = item;
      this.selected.emit({value: this.current});
    }
    this.toggleSelectItem();
  }

  toggleSelectItem() {
    this.selectItem  = !this.selectItem;
    this.state = (this.state == "active") ? "inactive" : "active";
  }

}
