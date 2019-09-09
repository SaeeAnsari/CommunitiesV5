import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDisplayPage } from './media-display.page';

describe('MediaDisplayPage', () => {
  let component: MediaDisplayPage;
  let fixture: ComponentFixture<MediaDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
