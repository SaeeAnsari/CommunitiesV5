import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
 

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  //{ path: '', redirectTo: 'login', pathMatch: 'full'} ,
  { path: 'community', loadChildren: './pages/community/community.module#CommunityPageModule' },
  { path: 'event-feed', loadChildren: './pages/event-feed/event-feed.module#EventFeedPageModule' },
  { path: 'live-feed', loadChildren: './pages/live-feed/live-feed.module#LiveFeedPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'media-display', loadChildren: './pages/media-display/media-display.module#MediaDisplayPageModule' },
  { path: 'my-communities', loadChildren: './pages/my-communities/my-communities.module#MyCommunitiesPageModule' },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'settings', redirectTo: 'login'},
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'tabs/:communityID', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'user-location', loadChildren: './pages/user-location/user-location.module#UserLocationPageModule' },
  { path: 'user-search-component', loadChildren: './pages/user-search-component/user-search-component.module#UserSearchComponentPageModule' },
  { path: 'user-search', loadChildren: './pages/user-search/user-search.module#UserSearchPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
