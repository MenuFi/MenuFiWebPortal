import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-summary-graph',
  templateUrl: './summary-graph.component.html',
  styleUrls: ['./summary-graph.component.css']
})
export class SummaryGraphComponent implements OnInit {

  @Input() restaurantId: number;

  constructor() { }

  ngOnInit() {
  }

}
