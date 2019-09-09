import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserSearchPage } from './user-search.page';
import { UserSearchItemComponent } from 'src/app/components/user-search-item-component/user-search-item-component.component';

const routes: Routes = [
  {
    path: '',
    component: UserSearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserSearchPage, UserSearchItemComponent]
})
export class UserSearchPageModule {}
