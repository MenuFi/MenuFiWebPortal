import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { MenuModule } from './menu/menu.module';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { environment } from '../environments/environment';
import { LoginServerService } from './login/login-server.service';
import { LoginMockService } from './login/login-mock.service';
import { LoginService } from './login/login.service';
import { AuthGuard } from './auth-guard.service';

let loginServiceImpl = environment.production ? LoginServerService : LoginMockService;


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MenuModule,
    AppRoutingModule
  ],
  providers: [{ provide: LoginService, useClass: loginServiceImpl }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
