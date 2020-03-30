import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';



import { IonicModule } from '@ionic/angular';

import { CommunityPage } from './community.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


import {LocalGalleryUploadCommunityComponent} from '../../components/local-gallery-upload-community/local-gallery-upload-community.component'

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
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FontAwesomeModule
  ],
  declarations: [CommunityPage, LocalGalleryUploadCommunityComponent]
  //declarations: [CommunityPage]

})
export class CommunityPageModule {}
