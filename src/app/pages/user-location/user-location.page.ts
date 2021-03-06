import { Component, Input } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserService } from '../../providers/user-service';
import { Router } from '@angular/router';

/**
 * Generated class for the UserLocation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-location',
  templateUrl: 'user-location.page.html',
  styleUrls: ['./user-location.page.scss'],
  providers: [UserService]
})
export class UserLocationPage {

  public completed: boolean = false;
  private defaultCommunityID: number = 0;
  @Input() LaunchType: string = "Registration";

  constructor(
    public navCtrl: NavController,
    private _geolocation: Geolocation,
    private _userService: UserService,
    private vc: ModalController,
    private router: Router,
    public loadingCtrl: LoadingController
  ) {


  }

  ionViewDidLoad() {


    console.log('ionViewDidLoad UserLocation');
  }

  locateMe() {

    let loading = this.loadingCtrl.create({
      message: 'Locating ...',
      spinner: 'dots'
    });

    loading.then(ret => {
      ret.present();

      this._geolocation.getCurrentPosition().then((resp) => {

        let userID = this._userService.GetLoggedInUserID();

        this._userService.SaveUserLocation(userID, resp.coords.latitude, resp.coords.longitude).subscribe(sub => {
          if (sub > 0) {
            this.defaultCommunityID = sub;//returns the defaultcommunityid
            this.completed = true;
          }
        });

        ret.dismiss();
      }).catch((error) => {
        console.log('Error getting location', error);
        ret.dismiss();
      });
    });
  }

  SendUserToApp() {
    //f (this.LaunchType == "Registration") {

    this.router.navigate(['tabs']);
    //this.navCtrl.navigateRoot("/tabs/" + this.defaultCommunityID)
    //this.navCtrl.push(TabsPage, { communityID: this.defaultCommunityID });
    //communityID
    //}
    //else if (this.LaunchType == "Settings") {
    //this.vc.dismiss();
    //}
  }

}
