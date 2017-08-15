import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-sr-graph',
  templateUrl: './sr-graph.component.html',
  styleUrls: ['./sr-graph.component.css']
})
export class SrGraphComponent implements OnInit {
  loading = true;
  matches = [];

  //graph options
  graph = {
    SRData: [],
    labels: [],
    masterLabels: [],
    masterSR: [],
    color: [{
      backgroundColor: 'rgb(85,129,142)',
      borderColor: 'rgb(85,129,142)'
    }],
    type: 'line',
    options: {
      animation: false,
      tooltips: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: this.getCustomTooltip
        }
      },
      scales: {
        xAxes: [{
          display: false
        }]
      }
    },
    controls: {
      drag: false,
      dataSize: 50,
      bounds: {
        upper: 0,
        lower: 0
      },
      currentX: 0
    }
  };

  constructor(private firebase: FirebaseService) { }

  ngOnInit() {
    this.firebase.getUserMatches()
    .subscribe(result => {
      this.matches = result;

      if(this.matches.length < 50) {
        this.graph.controls.dataSize = this.matches.length;
      }

      this.calculateBounds();
      let tempIndex = 1;

      for(let match of this.matches) {
        this.graph.masterSR.push(match.sr);
        this.graph.masterLabels.push(match.map + " (Match " + tempIndex + ")");
        tempIndex++;
      }

      this.fitDataset();
      this.loading = false;
    });
  }

  getCustomTooltip(tooltipItem, data) {
    let datasetIndex = tooltipItem.datasetIndex;
    let index = tooltipItem.index;
    let sr = tooltipItem.yLabel;
    let diff = 0;
    let label = "SR: " + sr;

    if(index > 0) {
      diff = sr - (data.datasets[datasetIndex].data[index-1]);
      label += " (";
      label += diff > 0 ? "+" : "";
      label += diff + ")"; 
    }

    return label;
  }

  calculateBounds() {
    let bounds = this.graph.controls.bounds;
    let size = this.graph.controls.dataSize;
    bounds.upper = size;
    bounds.lower = (bounds.upper - size) < 0 ? 0 : (bounds.upper - size);
  }

  fitDataset() {
    this.graph.labels = [];
    this.graph.SRData = [];
    let bounds = this.graph.controls.bounds;

    let sr = this.graph.masterSR.slice(bounds.lower, bounds.upper);
    this.graph.labels = this.graph.masterLabels.slice(bounds.lower, bounds.upper);

    this.graph.SRData = [
      {
        data: sr,
        label: "Skill Ranking",
        fill: false,
        pointRadius: 3
      }
    ];
  }

  mouseDown(evt) {
    this.graph.controls.drag = true;
    this.graph.controls.currentX = evt.layerX;
  }

  mouseUp(evt) {  
    this.graph.controls.drag = false;
  }

  mouseLeave(evt) { 
    this.graph.controls.drag = false;
  }

  mouseMove(evt) {
    if(this.graph.controls.drag) {
      let x = evt.layerX;
      let width = evt.target.width;
      let diff = x - this.graph.controls.currentX;
      let tickSize = (width / this.matches.length) / 2;
      let step = Math.abs(diff) > tickSize;
      let change = diff < 0 ? 1 : -1;

      if(step) {
        let bounds = this.graph.controls.bounds;
        this.graph.controls.currentX = x;
        if(change == -1 && (bounds.lower - 1) >= 0) {
          this.graph.controls.bounds.upper -= 1;
          this.graph.controls.bounds.lower -= 1;
          this.fitDataset();
        } else if(change == 1 && (bounds.upper + 1) <= this.matches.length) {
          this.graph.controls.bounds.upper += 1;
          this.graph.controls.bounds.lower += 1;
          this.fitDataset();
        }
      }
    }
  }

  wheelEvent(evt) { 
    let direction = evt.deltaY;
    let size = this.graph.controls.dataSize;

    if(direction <= 0 && size > 1) {
      this.graph.controls.dataSize--;
    } else if(direction > 0 && size < this.matches.length) {
      this.graph.controls.dataSize++;
    }
    this.calculateBounds();
    this.fitDataset();
    return false;
  }
}
