import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'LiveFeed',
        children: [
          {
            path: '',
            loadChildren: '../live-feed/live-feed.module#LiveFeedPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '../live-feed/live-feed.module#LiveFeedPageModule',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '../live-feed/live-feed.module#LiveFeedPageModule',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
