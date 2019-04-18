import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouter, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-discussion-page',
  templateUrl: './discussion-page.component.html',
  styleUrls: ['./discussion-page.component.css']
})
export class DiscussionPageComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  
  private eventid = this.route.snapshot.paramMap.get('id');
  private event;

  ngOnInit() {
    this.getEvent();
    this.testAuth();
  }


  getEvent() {
    this.http.get('http://localhost:3000/events/id', {params: {eventid: this.eventid}}).subscribe((data) => {
      console.log(data['json'][0]);
      this.event = data['json'][0];
    });
  }

  testAuth() {
    this.http.get('http://localhost:3000/api/user').subscribe((data) => {
      console.log(data);
    });
  }


}
