import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserLocationPage } from 'src/app/pages/user-location/user-location.page';
import { FirebaseMessagingProvider } from '../../providers/firebase-messaging/firebase-messaging'
import { NavController, NavParams, ModalController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Input } from '@angular/core';


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

  ngOnInit() { }

  public SignOut() {
    this.storage.clear();
    sessionStorage.setItem('userID', null);
    this.storage.set("userID", null);

    this.onDismiss();

    this.router.navigate(['/login']);


    //this.navCtrl.navigateRoot("/login");
    //this.app.getRootNav().setRoot(Login);
    //this.app.getActiveNav().setRoot(Login);
    //this.navCtrl.push(Login);
  }

  async launchUpdateLocation() {
    this.onDismiss();
    this.router.navigate(["/user-location"]);



  }

  SubscribeTest() {

    this.fcm.SubscibeToTopic("1628").then(ret=>{
      console.log("Menu: ubscribed to a topic")
    })
  }

  @Input()
  public onDismiss = () => { }
}
