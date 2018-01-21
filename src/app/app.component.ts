import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './shared/css/foundation.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public title: string;
  public isProduction: boolean;
  public serverBaseUrl: string;
  
  constructor() {
    this.title = 'MenuFi';
    this.isProduction = environment.production;
    this.serverBaseUrl = environment.serverBaseUrl;
  }
  
  ngOnInit() {
    $(document).foundation();
  }
}
