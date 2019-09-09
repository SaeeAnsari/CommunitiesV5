import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventFeedPage } from './event-feed.page';
import { MarkerNewPostComponent } from 'src/app/components/marker-new-post-component/marker-new-post-component.component';
import { UserTagComponent } from 'src/app/components/user-tag-component/user-tag-component.component';
import { EventPostComponent } from 'src/app/components/event-post/event-post.component';
import { UserPostActionComponent } from 'src/app/components/user-post-action-component/user-post-action-component.component';

const routes: Routes = [
  {
    path: '',
    component: EventFeedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventFeedPage, MarkerNewPostComponent, UserTagComponent, EventPostComponent, UserPostActionComponent]
})
export class EventFeedPageModule {}
