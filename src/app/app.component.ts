import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./shared/css/foundation.min.css', './app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public title: string;
  public isProduction: boolean;
  public serverBaseUrl: string;

  canRegister = false;
  
  constructor() {
    this.title = 'MenuFi';
    this.isProduction = environment.production;
    this.serverBaseUrl = environment.serverBaseUrl;
  }
  
  ngOnInit() {
  }
}
