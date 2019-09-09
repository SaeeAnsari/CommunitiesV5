import { Component, Input } from '@angular/core';
import { NavController, NavParams, ModalController} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserService } from '../../providers/user-service';
import { TabsPage } from '../../pages/tabs/tabs.page';

/**
 * Generated class for the UserLocation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-location',
  templateUrl: 'user-location.page.html',
  providers: [UserService]
})
export class UserLocationPage {

  private completed: boolean = false;
  private defaultCommunityID: number = 0;
  @Input() LaunchType: string = "Registration";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _geolocation: Geolocation,
    private _userService: UserService,
    private vc: ModalController
  ) {

    if (this.navParams.get("launchType")) {
      this.LaunchType = this.navParams.get("launchType");
    }
  }

  ionViewDidLoad() {


    console.log('ionViewDidLoad UserLocation');
  }

  locateMe() {
    this._geolocation.getCurrentPosition().then((resp) => {


      let userID = this._userService.GetLoggedInUserID();

      this._userService.SaveUserLocation(userID, resp.coords.latitude, resp.coords.longitude).subscribe(sub => {
        if (sub > 0) {
          this.defaultCommunityID = sub;//returns the defaultcommunityid
          this.completed = true;
        }
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  SendUserToApp() {
    if (this.LaunchType == "Registration") {
      this.navCtrl.navigateRoot("/tabs/" + this.defaultCommunityID)
      //this.navCtrl.push(TabsPage, { communityID: this.defaultCommunityID });
      //communityID
    }
    else if (this.LaunchType == "Settings") {
      this.vc.dismiss();
    }
  }

}
