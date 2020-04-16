import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/live-feed/live-feed.module').then(m => m.LiveFeedPageModule)
          }
        ]
      },
      {
        path: 'tab1/:communityID',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/live-feed/live-feed.module').then(m => m.LiveFeedPageModule)
          }
        ]
      },
      {
        path: 'UserSearch',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/user-search/user-search.module').then(m => m.UserSearchPageModule)
          }
        ]
      },
      {
        path: 'UserSearch/:communityID',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/user-search/user-search.module').then(m => m.UserSearchPageModule)
          }
        ]
      },
      {
        path: 'Communities',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/my-communities/my-communities.module').then(m => m.MyCommunitiesPageModule)
          }
        ]
      },
      {
        path: 'Notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: 'Settings',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
