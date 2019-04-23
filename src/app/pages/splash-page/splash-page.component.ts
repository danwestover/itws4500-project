import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-splash-page',
  templateUrl: './splash-page.component.html',
  styleUrls: ['./splash-page.component.css']
})
export class SplashPageComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
