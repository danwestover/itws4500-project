import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCommentModalComponent } from './add-comment-modal/add-comment-modal.component';
import { HttpParamsOptions } from '@angular/common/http/src/params';

@Component({
  selector: 'app-discussion-page',
  templateUrl: './discussion-page.component.html',
  styleUrls: ['./discussion-page.component.css']
})
export class DiscussionPageComponent implements OnInit {

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              public auth: AuthService,
              private modalService: NgbModal
            ) { }
  
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

  postComment(commentText: any) {
    const myHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);

    const params = `?eventid=${this.eventid}&author=${this.auth.getUserDetails().name}
    &author_id=${this.auth.getUserDetails()._id}&commenttext=${commentText}`;
    this.http.post(`http://localhost:3000/comment${params}`,
    {headers: myHeaders}).subscribe((apiRes) => {
      console.log(apiRes);
    });
    console.log(`posting: ${commentText} from ${this.auth.getUserDetails()._id} on ${this.eventid}`);
    setTimeout(() => {
      this.getEvent();
    }, 100);
  }

  openCommentModal() {
    const modalRef = this.modalService.open(AddCommentModalComponent);
    modalRef.componentInstance.id = this.eventid;
    modalRef.componentInstance.title = this.event.summary;

    modalRef.result.then((result) => {
      if (result !== '') {
        this.postComment(result.comment);
      }
    }).catch((error) => {
      console.error(error);
    });
  }


}
