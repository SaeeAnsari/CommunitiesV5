import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFeedPage } from './event-feed.page';

describe('EventFeedPage', () => {
  let component: EventFeedPage;
  let fixture: ComponentFixture<EventFeedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventFeedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
