import { Component, OnInit } from '@angular/core';
import { DropdownComponent } from '../../../dropdown/dropdown.component';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-map-graph',
  templateUrl: './map-graph.component.html',
  styleUrls: ['./map-graph.component.css']
})
export class MapGraphComponent implements OnInit {

  loading = true;
  selectedGraph = "All";
  mapOptions = [
    "All",
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
  ];

  graph = {
    All: {
      type: "horizontalBar",
      labels: [],
      datasets: [
        {data: null, label: "Won"},
        {data: null, label: "Drawn"},
        {data: null, label: "Loss"}
      ],
      colors: [
        { backgroundColor: 'rgb(91, 163, 75)' },
        { backgroundColor: 'rgb(252, 239, 58)' },
        { backgroundColor: 'rgb(219, 54, 54)' }
      ],
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    },
    maps: {}
  }

  winPercent;

  constructor(private firebase: FirebaseService) { }

  ngOnInit() {
    this.firebase.getUserMapData()
        .subscribe(result => {
          let tempWon = [];
          let tempDraw = [];
          let teampLoss = [];

          this.graph.All.labels = [];

          for(let name in result) {
            let map = result[name];

            this.graph.All.labels.push(name);
            tempWon.push(map.won);
            tempDraw.push(map.draw);
            teampLoss.push(map.lost);

            let tempMap = {
              type: "doughnut",
              labels: ["Won", "Draw", "Loss"],
              data: [map.won, map.draw, map.lost],
              colors: [{
                backgroundColor: ["rgb(91, 163, 75)", "rgb(252, 239, 58)", "rgb(219, 54, 54)"]
              }],
              winPercentage: this.calcMapWin(map)
            }
            this.graph.maps[name] = tempMap;
          }

          this.graph.All.datasets[0].data = tempWon;
          this.graph.All.datasets[1].data = tempDraw;
          this.graph.All.datasets[2].data = teampLoss;

          this.winPercent = this.calcWinPercentage(tempWon, tempDraw, teampLoss);

          this.loading = false;
        });
  }

  selectMap(response) {
    this.selectedGraph = response.value;
  }

  calcMapWin(map) {
    return Math.floor((map.won / (map.won + map.draw + map.lost)) * 100);
  }

  calcWinPercentage(won, draw, lost) {
    return Math.floor((this.addArr(won) / (this.addArr(won) + this.addArr(draw) + this.addArr(lost))) * 100);
  }

  addArr(arr) {
    let result = 0;
    for(let item of arr) {
      result += item;
    }
    return result;
  }
}
