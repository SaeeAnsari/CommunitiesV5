import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { ModalController, NavParams, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { Storage } from '@ionic/storage';
import { UserService } from '../../providers/user-service';
import { PopoverController } from '@ionic/angular';


/**
 * Generated class for the LoginComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'login-component',
  templateUrl: 'login-component.component.html',
  styleUrls: ['./login-component.component.scss'],
  providers: [UserService]
})
export class LoginComponent {

  text: string;

  public loginForm: FormGroup;
  public isRegistering: boolean;

  constructor(
    private storage: Storage,
    private _fb: FormBuilder,
    private _user: UserService,
    public nav: NavController,
    public vc: ModalController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private router: Router
  ) {

    this.loginForm = this._fb.group({
      email: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });

  }

  closeModal() {

    this.vc.dismiss();
  }

  registerClicked() {
    let data = {
      isRegistering: true
    };

    this.vc.dismiss(data);
  }

  loginUser(model, isValid: boolean) {

    console.log(model);
    if (isValid && isValid == true) {
      this._user.LoginUser(model.email, model.password).subscribe(sub => {
        if (sub > 0) {
          this.storage.set("userID", sub);
          sessionStorage.setItem("userID", sub);//Temporary removeit later
          this.router.navigate(['tabs/tab1']);

          //this.nav.navigateForward('/tabs/tab1');
          this.vc.dismiss({ isRegistering: false });
        }
        else {
          this.presentToast("Incorrect Email or Password");
        }
      })
    }
  }

  async presentToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss().then(() => {
      console.log('Dismissed toast');
    });

    return await toast.present();
  }


  forgetPassword(event) {

    let data = {
      forgetPassword: true
    };
    this.vc.dismiss(data);
  }
}
