import { Component } from '@angular/core';
import {UserService} from '../providers/user-service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(userService: UserService, navCtrl: NavController) {   

    if(userService.GetLoggedInUserID() <=0){
      navCtrl.navigateBack("/login");
    }

  }



}
