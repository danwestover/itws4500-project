import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService) { }

  navbarOpen = false;


  ngOnInit() {
  }

  toggleNav() {
    this.navbarOpen != this.navbarOpen;
  }

}
