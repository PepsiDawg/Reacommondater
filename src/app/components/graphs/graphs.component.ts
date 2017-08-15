import { Component, OnInit } from '@angular/core';
import { SrGraphComponent } from './components/sr-graph/sr-graph.component';
import { MapGraphComponent } from './components/map-graph/map-graph.component';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
