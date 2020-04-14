import { Component } from '@angular/core';
import { UserService } from '../providers/user-service';
import { NavController, Platform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public notifications = [];

  constructor(userService: UserService, navCtrl: NavController, private firebaseIonic: FCM,
    private platform: Platform, ) {

    this.onNotification();

    if (userService.GetLoggedInUserID() <= 0) {
      navCtrl.navigateBack("/login");
    }

  }

  async onNotification() {
    try {

      console.log("TABS: Inside Notification...");

      let notificationsString = sessionStorage.getItem("userNotification");

      if (notificationsString != null && notificationsString.length > 3) {
        this.notifications = JSON.parse(notificationsString);
      }

      await this.platform.ready();

      this.firebaseIonic.onNotification().subscribe(data => {
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });
      
      /*
      this.firebaseIonic.onNotification().subscribe(sub => {
        console.log("Notification Opened");
        console.log(sub);
        this.notifications.push(sub);
      });
      */
    }
    catch (e) {
      console.log('erroring');
      console.log(e)
    }
  }

}
