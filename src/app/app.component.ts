import { Component, ViewChild } from '@angular/core';
import {Platform, NavController, NavParams, IonNav } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx'

import { TabsPage } from '../app/pages/tabs/tabs.page';

import { LoginPage } from '../app/pages/login/login.page';

import { UserLocationPage } from '../app/pages/user-location/user-location.page';
import { MyCommunitiesPage } from '../app/pages/my-communities/my-communities.page';
import { UserSearchPage } from '../app/pages/user-search/user-search.page';
import { LiveFeedPage } from '../app/pages/live-feed/live-feed.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild(IonNav) navChild:IonNav;

  rootPage: any = LoginPage;
  //rootPage: any = TabsPage;//LiveFeed;//MyCommunitiesPage;//UserSearchComponent;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, deeplinks: Deeplinks) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      
      setTimeout(function () {
        splashScreen.hide();
      }, 2000);



      deeplinks.routeWithNavController(this.navChild, {
        '/login': LoginPage
      }).subscribe((match) => {
          // match.$route - the route we matched, which is the matched entry from the arguments to route()
          // match.$args - the args passed in the link
          // match.$link - the full link data
          console.log('Successfully matched route', match);
        }, (nomatch) => {
          // nomatch.$link - the full link data
          console.error('Got a deeplink that didn\'t match', nomatch);
        });
    });


  }
}
