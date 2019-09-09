import { Component } from '@angular/core';
import { UserService } from '../../providers/user-service';
import { ModalController, NavParams, NavController, ToastController } from '@ionic/angular';



/**
 * Generated class for the ForgetPasswordComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'forget-password',
  templateUrl: 'forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  providers: [UserService]

})
export class ForgetPasswordComponent {

  public email = "";

  text: string;

  constructor(
    private _user: UserService,
    public vc: ModalController,
    private toastCtrl: ToastController
  ) {

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

    await toast.present();
  }

  sendForgetPassEmail() {
    if (this.email != "") {
      this._user.EmailUserForgetPassword(this.email).subscribe(sub => {

        this.presentToast("Email sent to " + this.email);

        this.vc.dismiss();
        /*
        setTimeout(function () {
          this.vc.dismiss();
        }, 4000);
        */

      })
    }
    else {
      this.presentToast("Please enter an Email you registered with Communities");
    }
    console.log(this.email);
  }

  closeModal() {

    this.vc.dismiss();
  }
}
