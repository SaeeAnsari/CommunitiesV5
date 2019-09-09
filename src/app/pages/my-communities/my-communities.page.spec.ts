import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCommunitiesPage } from './my-communities.page';

describe('MyCommunitiesPage', () => {
  let component: MyCommunitiesPage;
  let fixture: ComponentFixture<MyCommunitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCommunitiesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCommunitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
