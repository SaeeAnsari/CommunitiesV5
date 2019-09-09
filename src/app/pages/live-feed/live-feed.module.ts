import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LiveFeedPage } from './live-feed.page';
import { CommunityTopicMarkerComponent } from 'src/app/components/community-topic-marker/community-topic-marker.component';
import { MarkerNewPostComponent } from 'src/app/components/marker-new-post-component/marker-new-post-component.component';
import { UserTagComponent } from 'src/app/components/user-tag-component/user-tag-component.component';
import { UserPostsComponent } from 'src/app/components/user-posts-component/user-posts-component.component';
import { UserPostActionComponent } from 'src/app/components/user-post-action-component/user-post-action-component.component';

const routes: Routes = [
  {
    path: '',
    component: LiveFeedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LiveFeedPage, CommunityTopicMarkerComponent, MarkerNewPostComponent, UserTagComponent, UserPostsComponent, UserPostActionComponent]
})
export class LiveFeedPageModule {}
