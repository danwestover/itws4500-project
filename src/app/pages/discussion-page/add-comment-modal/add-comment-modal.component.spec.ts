import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentModalComponent } from './add-comment-modal.component';

describe('AddCommentModalComponent', () => {
  let component: AddCommentModalComponent;
  let fixture: ComponentFixture<AddCommentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
