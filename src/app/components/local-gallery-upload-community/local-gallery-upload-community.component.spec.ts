import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalGalleryUploadCommunityComponent } from './local-gallery-upload-community.component';

describe('LocalGalleryUploadCommunityComponent', () => {
  let component: LocalGalleryUploadCommunityComponent;
  let fixture: ComponentFixture<LocalGalleryUploadCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalGalleryUploadCommunityComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalGalleryUploadCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
