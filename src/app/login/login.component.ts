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

  @Input() showRegister: boolean = true;

  usernameInput: string = '';
  passwordInput: string = '';

  private errorMessage: string;
  private showErrorMessage: boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    console.log(this.showRegister);
    this.errorMessage = "";
    this.showErrorMessage = false;
  }

  private login() {
    console.log("Attempting login for " + this.usernameInput + " with password of length " + this.passwordInput.length);
    this.loginService.loginUser(
      this.usernameInput,
      this.passwordInput,
      res => {
        console.log(res.data);
        this.showErrorMessage = false;
      },
      error => {
        this.showErrorMessage = true;
        this.errorMessage = error.message;
      });
  }

  private register() {
    console.log("Attempting register for " + this.usernameInput + " with password of length " + this.passwordInput.length);
    this.loginService.registerUser(
      this.usernameInput,
      this.passwordInput,
      res => {
        console.log(res.data);
        this.showErrorMessage = false;
      },
      error => {
        this.showErrorMessage = true;
        this.errorMessage = error.message;
      });

  }

}
