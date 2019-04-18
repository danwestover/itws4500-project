import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-discussion-page',
  templateUrl: './discussion-page.component.html',
  styleUrls: ['./discussion-page.component.css']
})
export class DiscussionPageComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  
  private eventid = this.route.snapshot.paramMap.get('id');
  private event;
  private comments = [];

  ngOnInit() {
    this.getEvent();
  }


  getEvent() {
    this.http.get('http://localhost:3000/events/id', {params: {eventid: this.eventid}}).subscribe((data) => {
      console.log(data['json'][0]);
      this.event = data['json'][0];
    });
    this.http.get('http://localhost:3000/events/comments', {params: {eventid: this.eventid}}).subscribe((data) => {
      console.log(data['json']);
      this.comments = data['json'][0]['comments'];
    });
  }
}
