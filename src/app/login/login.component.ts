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

  private message: string;
  private showMessage: boolean;
  private isError: boolean;
  private isLoading: boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    console.log(this.showRegister);
    this.message = "";
    this.showMessage = false;
    this.isError = false;
    this.isLoading = false;
  }

  private login() {
    this.showMessage = false;
    this.isLoading = true;
    console.log("Attempting login for " + this.usernameInput + " with password of length " + this.passwordInput.length);
    this.loginService.loginUser(
      this.usernameInput,
      this.passwordInput,
      res => {
        this.isLoading = false;
        console.log(res.data);
        this.showMessage = false;
      },
      error => {
        this.isLoading = false;
        this.isError = true;
        this.showMessage = true;
        this.message = error.message;
      });
  }

  private register() {
    this.showMessage = false;
    this.isLoading = true;
    console.log("Attempting register for " + this.usernameInput + " with password of length " + this.passwordInput.length);
    this.loginService.registerUser(
      this.usernameInput,
      this.passwordInput,
      res => {
        this.isLoading = false;
        this.isError = !res.data;
        console.log(res.data);
        this.showMessage = true;
        if (this.isError) {
          this.message = "Failed to register.";
        } else {
          this.message = "Successfully registered!";
        }
      },
      error => {
        this.isLoading = false;
        this.isError = true;
        this.showMessage = true;
        this.message = error.message;
      });

  }

}
