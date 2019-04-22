import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthService) { }

  public name: string;
  public email: string;

  ngOnInit() {
    this.name = this.auth.getUserDetails().name;
    this.email = this.auth.getUserDetails().email;
  }

}
