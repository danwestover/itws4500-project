import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css'],
})
export class EventsPageComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  private events = [];
  test = 'hi there';

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.http.get('http://localhost:3000/events').subscribe((data) => {
      // console.log(data['json']);
      this.events = data['json'];
    });
  }

  

}
