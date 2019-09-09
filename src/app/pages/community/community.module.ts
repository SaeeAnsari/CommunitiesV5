import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommunityPage } from './community.page';

import {LocalGalleryUploadComponent} from '../../components/local-gallery-upload/local-gallery-upload.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CommunityPage, LocalGalleryUploadComponent]
})
export class CommunityPageModule {}
