import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  @Input() showRegister: boolean = false;

  usernameInput: string = '';
  passwordInput: string = '';

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    console.log(this.showRegister);
  }

  private login() {
    console.log("Attempting login for " + this.usernameInput + " with password of length " + this.passwordInput.length);
    var obs: Observable<string> = this.loginService.loginUser(this.usernameInput, this.passwordInput);
    obs.subscribe(res => alert(res));
  }

  private register() {
    console.log("Attempting register for " + this.usernameInput + " with password of length " + this.passwordInput.length);
    var obs: Observable<boolean> = this.loginService.registerUser(this.usernameInput, this.passwordInput);
    obs.subscribe(res => {
      if (res) {
        alert("Registration succeeded!");
        this.login();
      } else {
        alert("Registration failed!");
      }
    });
  }

}
