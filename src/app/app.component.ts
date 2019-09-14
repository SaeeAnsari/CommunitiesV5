import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx'

import { LoginPage } from '../app/pages/login/login.page';

import { UserLocationPage } from '../app/pages/user-location/user-location.page';
import { MyCommunitiesPage } from '../app/pages/my-communities/my-communities.page';
import { UserSearchPage } from '../app/pages/user-search/user-search.page';
import { LiveFeedPage } from '../app/pages/live-feed/live-feed.page';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  rootPage: any = LoginPage;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    deeplinks: Deeplinks
  ) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();      

    });
  }
}
