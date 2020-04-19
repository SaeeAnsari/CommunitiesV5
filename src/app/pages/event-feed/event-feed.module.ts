import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventFeedPage } from './event-feed.page';

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
  declarations: [EventFeedPage, 
  //  MarkerNewPostComponent, UserTagComponent, EventPostComponent, UserPostActionComponent
  ]
})
export class EventFeedPageModule {}
