import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import { UserLocationPage } from 'src/app/pages/user-location/user-location.page';
import {FirebaseMessagingProvider} from '../../providers/firebase-messaging/firebase-messaging'
import { NavController, NavParams, ModalController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private storage: Storage,
    public modalCtrl: ModalController,
    public fcm: FirebaseMessagingProvider,
    private router: Router,
    private menu: MenuController
    ) { }

  ngOnInit() {}

  public SignOut() {
    this.storage.clear();
    sessionStorage.setItem('userID', null);    
    this.storage.set("userID", null);

    this.menu.close();

    this.router.navigate(['/login']);


    //this.navCtrl.navigateRoot("/login");
    //this.app.getRootNav().setRoot(Login);
    //this.app.getActiveNav().setRoot(Login);
    //this.navCtrl.push(Login);
  }

  async launchUpdateLocation() {
    /*
    let userLocationModal = await this.modalCtrl.create({
      component: UserLocationPage
    });
    //let userLocationModal = this.modalCtrl.create(UserLocation, {launchType:"Settings"} , { showBackdrop: true, enableBackdropDismiss: true });
    userLocationModal.present();
    */
   this.menu.close();
   this.router.navigate(["/user-location"])
  }

  SubscribeTest(){
    this.menu.close();
    this.fcm.SubscibeToTopic("1338");
  }

}
