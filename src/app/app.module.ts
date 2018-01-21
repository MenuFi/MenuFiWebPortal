import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { environment } from '../environments/environment';
import { LoginServerService } from './login/login-server.service';
import { LoginMockService } from './login/login-mock.service';
import { LoginService } from './login/login.service';

let loginServiceImpl = environment.production ? LoginServerService : LoginMockService;


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [{ provide: LoginService, useClass: loginServiceImpl }],
  bootstrap: [AppComponent]
})
export class AppModule { }
