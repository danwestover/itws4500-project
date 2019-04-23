import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  public errorMsg: string;

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
      this.errorMsg = err.error.message;
    });
  }

}
