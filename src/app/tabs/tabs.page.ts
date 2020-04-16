import { Component } from '@angular/core';
import { UserService } from '../providers/user-service';
import { NavController, Platform, ModalController, PopoverController } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { MenuComponent } from '../components/menu/menu.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public notifications = [];

  constructor(userService: UserService, navCtrl: NavController, private firebaseIonic: FCM, private modal: ModalController,
    private platform: Platform, private popoverCtrl: PopoverController) {

    this.onNotification();

    if (userService.GetLoggedInUserID() <= 0) {
      navCtrl.navigateBack("/login");
    }    

    this.firebaseIonic.getToken().then(ret => {
      console.log("tabs: fcm: Getting Token -- Success");
      sessionStorage.setItem("messagingToken", ret);
    }).catch(ex=>{
      console.log("tabs: fcm:  Getting Token -- Expection");
      console.log(ex);
    });

    this.firebaseIonic.onTokenRefresh().subscribe(ref=>{
      console.log("tabs: fcm: refreshing firebase token");
      sessionStorage.setItem("messagingToken", ref);
    });
  }

  async onNotification() {
    try {

      console.log("TABS: Inside Notification...");

      let notificationsString = sessionStorage.getItem("userNotification");

      if (notificationsString != null && notificationsString.length > 3) {
        this.notifications = JSON.parse(notificationsString);
      }

      await this.platform.ready();

      console.log("fcm: Ready to receive new FCM notifications")

      this.firebaseIonic.onNotification().subscribe(data => {

        console.log("fcm: Notification: Receive Raw")

        if (data.wasTapped) {
          console.log("fcm: Received in background - data: " + JSON.stringify(data) );          
          this.notifications.push(data)
        } else {
          console.log("fcm: Received in foreground - data: " + JSON.stringify(data));
          this.notifications.push(data)
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

  async launchSettingsModel(){



    let popover = await this.popoverCtrl.create({
      component: MenuComponent      
    });


    popover.present();

    /*
    let menu = await this.modal.create({
      component: MenuComponent
    });    
    menu.present();
    */
  }
}
