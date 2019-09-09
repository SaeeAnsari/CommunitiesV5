import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
//import { NativeStorage} from '@ionic-native/native-storage/ngx';
import {Storage} from '@ionic/storage';
import { UserLocationPage } from '../user-location/user-location.page';

import {FirebaseMessagingProvider} from '../../providers/firebase-messaging/firebase-messaging'

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.page.html',
  providers: [FirebaseMessagingProvider]
})
export class SettingsPage {

  constructor(
    //public navCtrl: NavController,
    //public navParams: NavParams,
    private storage: Storage,
    public modalCtrl: ModalController,
    public fcm: FirebaseMessagingProvider,
    public navCtrl: NavController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  SignOut() {
    this.storage.clear();
    sessionStorage.setItem('userID', null);    
    this.storage.set("userID", null);

    this.navCtrl.navigateRoot("/login");
    //this.app.getRootNav().setRoot(Login);
    //this.app.getActiveNav().setRoot(Login);
    
    //this.navCtrl.push(Login);
  }

  async launchUpdateLocation() {
    let userLocationModal = await this.modalCtrl.create({
      component: UserLocationPage
    });
    //let userLocationModal = this.modalCtrl.create(UserLocation, {launchType:"Settings"} , { showBackdrop: true, enableBackdropDismiss: true });
    userLocationModal.present();
  }

  SubscribeTest(){
    this.fcm.SubscibeToTopic("1338");
  }

}
